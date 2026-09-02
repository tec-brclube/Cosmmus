/**
 * COSMMUS BUSINESS — Recebedor do Formulário de Caracterização Organizacional
 *
 * Cole este código no editor de Apps Script da planilha que vai receber as respostas
 * (Extensões → Apps Script) e implante como "Aplicativo da Web".
 * Passo a passo completo em docs/FORMULARIO-SHEETS.md
 *
 * O site salva as respostas continuamente, à medida que a pessoa preenche.
 * Cada envio é identificado pelo PROTOCOLO: o primeiro salvamento cria a linha
 * e os seguintes apenas atualizam a mesma linha, sem duplicar registros.
 */

/**
 * Aba usada quando o site não informa uma. Cada formulário grava na sua
 * própria aba (campo "aba" do envio), criada automaticamente na primeira
 * resposta: 'Respostas' para a caracterização organizacional e
 * 'Diagnostico Cosmmus' para o formulário de diagnóstico.
 */
const SHEET_PADRAO = 'Respostas';

/** Evita que um envio adulterado crie abas com nomes estranhos. */
const ABAS_PERMITIDAS = ['Respostas', 'Diagnostico Cosmmus'];

/**
 * Quem recebe aviso quando um formulário é CONCLUÍDO. Vários endereços,
 * separados por vírgula. Deixe vazio ('') para não notificar ninguém.
 *
 * O aviso sai só no envio final — os salvamentos automáticos, que acontecem
 * enquanto a pessoa preenche, não disparam e-mail.
 */
const NOTIFY_EMAIL = 'marcos@brclube.org,marcos@cosmmus.com';

/**
 * Webhook do Google Chat que recebe aviso de formulário concluído.
 *
 * DEIXE VAZIO NO REPOSITÓRIO. A URL contém chave e token de acesso ao espaço
 * do chat: preencha somente aqui no editor do Apps Script, que não é público.
 * Quem tiver a URL consegue publicar mensagens no espaço.
 *
 * Vazio ('') = não avisa no chat.
 */
const CHAT_WEBHOOK = '';

/**
 * Recebe o POST do site e grava ou atualiza a linha do protocolo.
 * As colunas são casadas por NOME de cabeçalho, então alterar a ordem das
 * perguntas no site não desalinha os dados já gravados.
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const payload = JSON.parse(e.postData.contents);
    const incomingHeaders = (payload.headers || []).slice();
    const incomingRow = (payload.row || []).slice();
    const protocolo = payload.protocolo || '';

    /**
     * Dimensionamento (IPC): só faz sentido com o formulário inteiro, então
     * roda apenas no envio final. Enquanto está sendo preenchido, as colunas
     * do modelo ficam em branco.
     */
    let avaliacao = null;
    if (payload.status === 'Concluído' && typeof avaliar === 'function') {
      try {
        avaliacao = avaliar(incomingHeaders, incomingRow);
        for (let a = 0; a < COLUNAS_AVALIACAO.length; a++) {
          incomingHeaders.push(COLUNAS_AVALIACAO[a]);
          incomingRow.push(avaliacao.valores[a]);
        }
      } catch (erroModelo) {
        console.error('Falha ao calcular o IPC: ' + erroModelo);
      }
    }

    const nomeAba = ABAS_PERMITIDAS.indexOf(payload.aba) === -1 ? SHEET_PADRAO : payload.aba;

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(nomeAba);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(nomeAba);
    }

    // Primeira execução: cria a linha de cabeçalho
    if (sheet.getLastRow() === 0) {
      writeHeaders(sheet, 1, incomingHeaders);
      sheet.setFrozenRows(1);
      sheet.setRowHeight(1, 60);
    }

    let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Perguntas novas viram colunas novas no fim da planilha
    const missing = incomingHeaders.filter(function (header) {
      return headers.indexOf(header) === -1;
    });
    if (missing.length > 0) {
      if (typeof garantirColunas === 'function') garantirColunas(sheet, headers.length + missing.length);
      writeHeaders(sheet, headers.length + 1, missing);
      headers = headers.concat(missing);
    }

    const existingRow = findRowByProtocol(sheet, headers, protocolo);

    /**
     * Valores que já estão na linha. Colunas que o site não envia — anotações,
     * status de revisão, colunas criadas à mão — são preservadas em vez de
     * apagadas a cada salvamento.
     */
    const atuais = existingRow > 0 ? sheet.getRange(existingRow, 1, 1, headers.length).getValues()[0] : [];

    // Monta a linha na ordem das colunas existentes
    const row = headers.map(function (header, posicao) {
      const index = incomingHeaders.indexOf(header);
      if (index !== -1) return incomingRow[index];
      return atuais[posicao] === undefined ? '' : atuais[posicao];
    });

    if (existingRow > 0) {
      sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }

    /**
     * Avisos, apenas no envio final.
     *
     * Cada um é isolado: uma falha no e-mail (cota do Google estourada,
     * endereço recusado) não pode impedir o aviso no Chat, nem devolver erro
     * ao site — a resposta do cliente já está gravada acima, e é o que
     * importa. As falhas ficam no log de execuções.
     */
    if (payload.status === 'Concluído') {
      tentarAvisar('e-mail', function () {
        if (NOTIFY_EMAIL) notify(payload, headers, row, avaliacao);
      });
      tentarAvisar('Google Chat', function () {
        if (CHAT_WEBHOOK) notificarChat(payload, headers, row, avaliacao);
      });
    }

    return jsonOutput({
      result: 'success',
      protocolo: protocolo,
      aba: nomeAba,
      acao: existingRow > 0 ? 'atualizado' : 'criado',
    });
  } catch (error) {
    return jsonOutput({ result: 'error', message: String(error) });
  } finally {
    lock.releaseLock();
  }
}

/** Executa um aviso sem deixar que a falha dele derrube o resto. */
function tentarAvisar(canal, acao) {
  try {
    acao();
  } catch (erro) {
    console.error('Falha ao avisar por ' + canal + ': ' + erro);
  }
}

/**
 * Reenvia os avisos de um formulário já gravado.
 *
 * Serve quando um aviso se perdeu — webhook não configurado na hora, cota de
 * e-mail estourada, script fora do ar. Os dados são lidos da planilha, então
 * o aviso sai idêntico ao que teria saído na hora.
 *
 * COMO USAR: no editor, troque o protocolo abaixo e execute reenviarAviso.
 */
function reenviarAviso(protocolo) {
  var alvo = protocolo || 'COLE-O-PROTOCOLO-AQUI';

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var abas = ['Diagnostico Cosmmus', 'Respostas'];

  for (var a = 0; a < abas.length; a++) {
    var aba = ss.getSheetByName(abas[a]);
    if (!aba || aba.getLastRow() < 2) continue;

    var headers = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];
    var linha = findRowByProtocol(aba, headers, alvo);
    if (linha < 1) continue;

    var row = aba.getRange(linha, 1, 1, headers.length).getValues()[0];
    var payload = {
      formulario: abas[a] === 'Respostas' ? 'Caracterização Organizacional — Riscos Psicossociais' : 'Diagnóstico Cosmmus',
      protocolo: alvo,
      status: 'Concluído',
      dataHora: row[headers.indexOf('Data/hora')] || '',
    };

    var avaliacao = null;
    if (typeof avaliar === 'function') {
      try {
        avaliacao = avaliar(headers, row);
      } catch (erro) {
        console.error('Não consegui recalcular o IPC: ' + erro);
      }
    }

    tentarAvisar('e-mail', function () {
      if (NOTIFY_EMAIL) notify(payload, headers, row, avaliacao);
    });
    tentarAvisar('Google Chat', function () {
      if (CHAT_WEBHOOK) notificarChat(payload, headers, row, avaliacao);
    });

    var recado = 'Avisos reenviados para ' + alvo + ' (aba ' + abas[a] + ', linha ' + linha + ').';
    console.log(recado);
    return recado;
  }

  var naoAchei = 'Não encontrei o protocolo ' + alvo + ' em nenhuma das abas.';
  console.log(naoAchei);
  return naoAchei;
}

/** Permite testar a implantação abrindo a URL no navegador. */
function doGet() {
  return jsonOutput({ result: 'ok', message: 'Endpoint ativo. Envie os dados via POST.' });
}

/** Localiza a linha do protocolo. Retorna 0 quando não existe. */
function findRowByProtocol(sheet, headers, protocolo) {
  if (!protocolo) return 0;

  const protocolColumn = headers.indexOf('Protocolo') + 1;
  if (protocolColumn < 1) return 0;

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  const values = sheet.getRange(2, protocolColumn, lastRow - 1, 1).getValues();
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim() === String(protocolo).trim()) {
      return i + 2; // +2 porque a busca começa na linha 2
    }
  }
  return 0;
}

/** Escreve e formata cabeçalhos a partir de uma coluna. */
function writeHeaders(sheet, startColumn, values) {
  sheet
    .getRange(1, startColumn, 1, values.length)
    .setValues([values])
    .setFontWeight('bold')
    .setBackground('#120b24')
    .setFontColor('#ffffff')
    .setWrap(true);
}

function notify(payload, headers, row, avaliacao) {
  const valueOf = function (headerName) {
    const index = headers.indexOf(headerName);
    return index === -1 ? '' : row[index];
  };

  /** Primeira coluna preenchida entre as informadas. */
  const primeiroDe = function (nomes) {
    for (let i = 0; i < nomes.length; i++) {
      const valor = valueOf(nomes[i]);
      if (valor) return valor;
    }
    return '';
  };

  const organizacao = primeiroDe([
    '1.2 Nome fantasia',
    '1.1 Razão social',
    '2 Nome da empresa, organização, projeto ou iniciativa',
  ]);
  const responsavel = primeiroDe([
    '2.1 Nome completo',
    '1 Nome da pessoa responsável pelo preenchimento',
  ]);
  const email = primeiroDe(['2.4 E-mail profissional', 'C1 E-mail para contato']);
  const telefone = primeiroDe(['2.5 Telefone ou WhatsApp', 'C2 WhatsApp']);

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'Formulário concluído — ' + (organizacao || payload.protocolo || ''),
    body:
      'Um formulário foi CONCLUÍDO no site.\n\n' +
      'Formulário: ' + (payload.formulario || '') + '\n' +
      'Protocolo: ' + (payload.protocolo || '') + '\n' +
      'Início do preenchimento: ' + (payload.dataHora || '') + '\n' +
      'Organização: ' + organizacao + '\n' +
      'Responsável: ' + responsavel + '\n' +
      'E-mail: ' + email + '\n' +
      'Telefone: ' + telefone + '\n' +
      (avaliacao ? 'Dimensionamento: IPC ' + avaliacao.ipc + ' — ' + avaliacao.nivel.nome + '\n' : '') +
      (avaliacao ? 'Faixa de referência: R$ ' + avaliacao.precoMin + ' a R$ ' + avaliacao.precoMax + ' (aguardando revisão humana)\n' : '') +
      '\nAbra a planilha para ver todas as respostas.',
  });
}

/**
 * Publica um aviso no espaço do Google Chat.
 *
 * Roda depois de a linha já estar gravada: se o chat estiver fora do ar ou a
 * URL estiver errada, a resposta do cliente não se perde — apenas o aviso
 * deixa de sair, e o erro fica registrado no log de execuções.
 */
/** Colunas de controle e do modelo: já vão no resumo, não se repetem na lista. */
var COLUNAS_FORA_DA_LISTA = [
  'Data/hora',
  'Protocolo',
  'Status',
  'Última atualização',
  'Etapa alcançada',
];

/** Limite de caracteres por mensagem no Google Chat, com folga. */
var LIMITE_CHAT = 3800;

/**
 * Publica no espaço do Google Chat o resumo e, em seguida, todas as respostas.
 *
 * As mensagens vão agrupadas numa conversa só, identificada pelo protocolo,
 * para o espaço não encher de mensagens soltas. Respostas longas são
 * quebradas em partes, porque o Chat recusa mensagem acima de 4 mil
 * caracteres.
 *
 * Roda depois de a linha já estar gravada: se o Chat falhar, a resposta do
 * cliente não se perde — o erro fica no log de execuções.
 */
function notificarChat(payload, headers, row, avaliacao) {
  var valueOf = function (headerName) {
    var index = headers.indexOf(headerName);
    return index === -1 ? '' : row[index];
  };

  var primeiroDe = function (nomes) {
    for (var i = 0; i < nomes.length; i++) {
      var valor = valueOf(nomes[i]);
      if (valor) return valor;
    }
    return '';
  };

  var porInicio = function (inicio) {
    for (var i = 0; i < headers.length; i++) {
      if (String(headers[i]).indexOf(inicio) === 0) return row[i] || '';
    }
    return '';
  };

  var organizacao = primeiroDe([
    '1.2 Nome fantasia',
    '1.1 Razão social',
    '2 Nome da empresa, organização, projeto ou iniciativa',
  ]);
  var responsavel = primeiroDe(['2.1 Nome completo', '1 Nome da pessoa responsável pelo preenchimento']);
  var email = primeiroDe(['2.4 E-mail profissional', 'C1 E-mail para contato']);
  var telefone = primeiroDe(['2.5 Telefone ou WhatsApp', 'C2 WhatsApp']);
  var instagram = porInicio('C3 ');
  var segmento = porInicio('2.1 Qual é o segmento');
  var cidade = porInicio('2.2 Em qual cidade');

  // ── Resumo, para decidir sem abrir nada ──
  var resumo = ['*Novo formulário concluído* — ' + (payload.formulario || '')];
  if (organizacao) resumo.push('*Organização:* ' + organizacao);
  if (segmento) resumo.push('*Segmento:* ' + segmento);
  if (cidade) resumo.push('*Cidade:* ' + cidade);
  if (responsavel) resumo.push('*Responsável:* ' + responsavel);
  if (email) resumo.push('*E-mail:* ' + email);
  if (telefone) resumo.push('*WhatsApp:* ' + telefone);
  if (instagram) resumo.push('*Instagram:* ' + instagram);
  if (avaliacao) {
    resumo.push('*Dimensionamento:* IPC ' + avaliacao.ipc + ' — ' + avaliacao.nivel.nome);
    resumo.push(
      '*Referência interna:* R$ ' + avaliacao.precoMin + ' a R$ ' + avaliacao.precoMax +
      ' · ' + avaliacao.nivel.horasMin + '–' + avaliacao.nivel.horasMax + 'h' +
      ' · equipe ' + avaliacao.nivel.equipe + ' · ' + avaliacao.nivel.prazo,
    );
    resumo.push('_' + avaliacao.alerta + ' · aguardando revisão humana_');
  }
  resumo.push('*Protocolo:* ' + (payload.protocolo || ''));

  try {
    resumo.push('<' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '|Abrir a planilha>');
  } catch (erro) {
    // sem link: segue sem ele
  }

  // ── Todas as respostas, na ordem do formulário ──
  var respostas = ['*Respostas completas* — ' + (organizacao || payload.protocolo || '')];
  for (var i = 0; i < headers.length; i++) {
    var pergunta = String(headers[i] || '');
    var resposta = String(row[i] === undefined || row[i] === null ? '' : row[i]).trim();

    if (!pergunta || !resposta) continue; // pergunta da outra trilha, ou não respondida
    if (COLUNAS_FORA_DA_LISTA.indexOf(pergunta) !== -1) continue;
    if (typeof COLUNAS_AVALIACAO !== 'undefined' && COLUNAS_AVALIACAO.indexOf(pergunta) !== -1) continue;

    if (resposta.length > 500) resposta = resposta.slice(0, 500) + '…';
    respostas.push('*' + pergunta + '*\n' + resposta);
  }

  var partes = quebrarEmMensagens([resumo.join('\n')].concat(respostas.join('\n\n')));
  for (var p = 0; p < partes.length; p++) {
    enviarAoChat(partes[p], payload.protocolo || '');
  }
}

/**
 * Divide o conteúdo em mensagens que caibam no limite do Chat, quebrando
 * entre parágrafos para nunca cortar uma resposta ao meio.
 */
function quebrarEmMensagens(blocos) {
  var mensagens = [];
  for (var b = 0; b < blocos.length; b++) {
    var paragrafos = String(blocos[b]).split('\n\n');
    var atual = '';
    for (var i = 0; i < paragrafos.length; i++) {
      var pedaco = paragrafos[i];
      if (atual && (atual.length + pedaco.length + 2) > LIMITE_CHAT) {
        mensagens.push(atual);
        atual = pedaco;
      } else {
        atual = atual ? atual + '\n\n' + pedaco : pedaco;
      }
    }
    if (atual) mensagens.push(atual);
  }
  return mensagens;
}

/** Publica uma mensagem, agrupando pelo protocolo na mesma conversa. */
function enviarAoChat(texto, chaveDaConversa) {
  try {
    var separador = CHAT_WEBHOOK.indexOf('?') === -1 ? '?' : '&';
    var url = CHAT_WEBHOOK;
    if (chaveDaConversa) {
      url += separador + 'threadKey=' + encodeURIComponent(chaveDaConversa) +
        '&messageReplyOption=REPLY_MESSAGE_FALLBACK_TO_NEW_THREAD';
    }
    UrlFetchApp.fetch(url, {
      method: 'post',
      contentType: 'application/json; charset=UTF-8',
      payload: JSON.stringify({ text: texto }),
      muteHttpExceptions: true,
    });
  } catch (erro) {
    console.error('Falha ao avisar no Google Chat: ' + erro);
  }
}

/**
 * Diagnóstico dos avisos — rode quando algo parar de chegar.
 *
 * Confere, em ordem, o que costuma dar errado: a URL do Chat apagada ao colar
 * o arquivo, a implantação desatualizada e o estado das últimas respostas.
 * Ao final, dispara uma mensagem de teste no Chat.
 *
 * COMO USAR: selecione testarAvisos no menu de funções e clique em Executar.
 * O resultado aparece no registro de execução, embaixo.
 */
function testarAvisos() {
  var linhas = ['── Diagnóstico dos avisos ──'];

  // 1. A URL do Chat está preenchida?
  if (!CHAT_WEBHOOK) {
    linhas.push('✗ CHAT_WEBHOOK está VAZIO.');
    linhas.push('  É a causa mais comum: colar o arquivo do repositório apaga a URL,');
    linhas.push('  porque ela não fica versionada. Cole a URL entre as aspas da linha');
    linhas.push("  const CHAT_WEBHOOK = '';  — depois salve e implante nova versão.");
  } else {
    linhas.push('✓ CHAT_WEBHOOK preenchido (' + CHAT_WEBHOOK.length + ' caracteres).');
    if (CHAT_WEBHOOK.indexOf('chat.googleapis.com') === -1) {
      linhas.push('  ⚠ A URL não parece ser de um webhook do Google Chat.');
    }
  }

  // 2. E o aviso por e-mail?
  linhas.push(NOTIFY_EMAIL ? '✓ NOTIFY_EMAIL: ' + NOTIFY_EMAIL : '✗ NOTIFY_EMAIL vazio (não avisa por e-mail).');

  // 3. As últimas respostas chegaram, e em que estado?
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var aba = ss.getSheetByName('Diagnostico Cosmmus');
    if (!aba) {
      linhas.push('✗ Não encontrei a aba "Diagnostico Cosmmus".');
    } else {
      var ultima = aba.getLastRow();
      linhas.push('✓ Aba encontrada, com ' + Math.max(ultima - 1, 0) + ' resposta(s).');
      if (ultima >= 2) {
        var cabecalhos = aba.getRange(1, 1, 1, aba.getLastColumn()).getValues()[0];
        var colStatus = cabecalhos.indexOf('Status') + 1;
        var colData = cabecalhos.indexOf('Data/hora') + 1;
        var quantas = Math.min(3, ultima - 1);
        var recentes = aba.getRange(ultima - quantas + 1, 1, quantas, aba.getLastColumn()).getValues();
        linhas.push('  Últimas ' + quantas + ':');
        for (var i = 0; i < recentes.length; i++) {
          var status = colStatus > 0 ? recentes[i][colStatus - 1] : '?';
          var data = colData > 0 ? recentes[i][colData - 1] : '?';
          linhas.push('   · ' + data + ' — ' + status);
        }
        linhas.push('  Lembre: o aviso só sai em "Concluído". Formulário abandonado');
        linhas.push('  no meio fica como "Em preenchimento" e não dispara nada.');
      }
    }
  } catch (erro) {
    linhas.push('✗ Erro ao ler a planilha: ' + erro);
  }

  // 4. Envia de fato, e mostra a resposta do Google
  if (CHAT_WEBHOOK) {
    try {
      var resposta = UrlFetchApp.fetch(CHAT_WEBHOOK, {
        method: 'post',
        contentType: 'application/json; charset=UTF-8',
        payload: JSON.stringify({ text: '*Teste do script* — se esta mensagem chegou, o envio pelo Apps Script está funcionando. Pode ignorar.' }),
        muteHttpExceptions: true,
      });
      var codigo = resposta.getResponseCode();
      linhas.push(codigo === 200
        ? '✓ Mensagem de teste enviada ao Chat (HTTP 200). Confira o espaço.'
        : '✗ O Chat recusou: HTTP ' + codigo + ' — ' + resposta.getContentText().slice(0, 300));
    } catch (erro) {
      linhas.push('✗ Falha ao chamar o Chat: ' + erro);
    }
  }

  linhas.push('');
  linhas.push('Se tudo acima estiver ✓ e mesmo assim nada chegar quando alguém');
  linhas.push('preencher o formulário, falta implantar: Implantar → Gerenciar');
  linhas.push('implantações → editar → Versão: Nova → Implantar. Sem isso o site');
  linhas.push('continua conversando com a versão antiga do script.');

  var texto = linhas.join('\n');
  console.log(texto);
  try {
    SpreadsheetApp.getUi().alert(texto);
  } catch (erro) {
    // rodando pelo editor, sem planilha aberta: o log basta
  }
  return texto;
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
