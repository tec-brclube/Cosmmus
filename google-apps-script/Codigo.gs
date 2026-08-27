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

    // Notifica apenas quando o formulário é finalizado
    if (payload.status === 'Concluído') {
      if (NOTIFY_EMAIL) notify(payload, headers, row, avaliacao);
      if (CHAT_WEBHOOK) notificarChat(payload, headers, row, avaliacao);
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
function notificarChat(payload, headers, row, avaliacao) {
  const valueOf = function (headerName) {
    const index = headers.indexOf(headerName);
    return index === -1 ? '' : row[index];
  };

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
  const responsavel = primeiroDe(['2.1 Nome completo', '1 Nome da pessoa responsável pelo preenchimento']);
  const email = primeiroDe(['2.4 E-mail profissional', 'C1 E-mail para contato']);
  const telefone = primeiroDe(['2.5 Telefone ou WhatsApp', 'C2 WhatsApp']);
  const segmento = valueOf('2.1 Qual é o segmento ou a atividade principal?');
  const cidade = valueOf('2.2 Em qual cidade a iniciativa está baseada?');
  const necessidade = primeiroDe([
    '6 Em poucas palavras, quais são hoje as três principais preocupações, problemas, necessidades ou oportunidades que levaram você a procurar a Cosmmus?',
  ]);

  const linhas = ['*Novo formulário concluído* — ' + (payload.formulario || '')];
  if (organizacao) linhas.push('*Organização:* ' + organizacao);
  if (segmento) linhas.push('*Segmento:* ' + segmento);
  if (cidade) linhas.push('*Cidade:* ' + cidade);
  if (responsavel) linhas.push('*Responsável:* ' + responsavel);
  if (email) linhas.push('*E-mail:* ' + email);
  if (telefone) linhas.push('*WhatsApp:* ' + telefone);
  if (necessidade) linhas.push('*O que procura:* ' + String(necessidade).slice(0, 300));
  if (avaliacao) {
    linhas.push('*Dimensionamento:* IPC ' + avaliacao.ipc + ' — ' + avaliacao.nivel.nome);
    linhas.push('*Referência interna:* R$ ' + avaliacao.precoMin + ' a R$ ' + avaliacao.precoMax + ' · ' + avaliacao.nivel.horasMin + '–' + avaliacao.nivel.horasMax + 'h · equipe ' + avaliacao.nivel.equipe + ' · ' + avaliacao.nivel.prazo);
    linhas.push('_' + avaliacao.alerta + ' · aguardando revisão humana_');
  }
  linhas.push('*Protocolo:* ' + (payload.protocolo || ''));

  try {
    const url = SpreadsheetApp.getActiveSpreadsheet().getUrl();
    linhas.push('<' + url + '|Abrir a planilha>');
  } catch (erro) {
    // sem link: segue sem ele
  }

  try {
    UrlFetchApp.fetch(CHAT_WEBHOOK, {
      method: 'post',
      contentType: 'application/json; charset=UTF-8',
      payload: JSON.stringify({ text: linhas.join('\n') }),
      muteHttpExceptions: true,
    });
  } catch (erro) {
    console.error('Falha ao avisar no Google Chat: ' + erro);
  }
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
