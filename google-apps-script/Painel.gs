/**
 * COSMMUS BUSINESS — Painel de oportunidades
 *
 * Cria (ou recria) a aba "Painel" dentro desta mesma planilha, com a visão
 * gerencial das respostas do Diagnóstico: quantas chegaram, distribuição por
 * nível de complexidade, valor do funil e a lista de oportunidades ordenada
 * da mais complexa para a mais simples.
 *
 * COMO USAR: no editor do Apps Script, selecione a função criarPainel no menu
 * de funções e clique em Executar. Rode de novo sempre que quiser atualizar a
 * estrutura — os números se atualizam sozinhos, porque são fórmulas.
 *
 * O painel apenas LÊ as colunas que o Avaliacao.gs grava. Quem calcula é o
 * script; assim existe uma fonte de verdade só.
 */

/** Aba que recebe as respostas do Diagnóstico. */
var ABA_DADOS = 'Diagnostico Cosmmus';
var ABA_PAINEL = 'Painel';

/** Converte o número da coluna em letra (1 → A, 27 → AA). */
function colunaParaLetra(numero) {
  var letra = '';
  while (numero > 0) {
    var resto = (numero - 1) % 26;
    letra = String.fromCharCode(65 + resto) + letra;
    numero = Math.floor((numero - resto) / 26);
  }
  return letra;
}

function criarPainel() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var dados = ss.getSheetByName(ABA_DADOS);
  if (!dados) {
    throw new Error('Não encontrei a aba "' + ABA_DADOS + '". Confira o nome da aba das respostas.');
  }

  var headers = dados.getRange(1, 1, 1, dados.getLastColumn()).getValues()[0];

  /** Letra da coluna cujo cabeçalho começa com o texto informado. */
  function letra(inicioDoCabecalho) {
    for (var i = 0; i < headers.length; i++) {
      if (String(headers[i]).indexOf(inicioDoCabecalho) === 0) return colunaParaLetra(i + 1);
    }
    return null;
  }

  var cStatus = letra('Status');
  var cIpc = letra('IPC (9-36)');
  var cNivel = letra('Nível');
  var cMin = letra('Preço referência mín.');
  var cMax = letra('Preço referência máx.');
  var cAlerta = letra('Alerta');
  var cProtocolo = letra('Protocolo');
  var cEmpresa = letra('2 Nome da empresa');
  var cSegmento = letra('2.1 ');
  var cCidade = letra('2.2 ');
  var cSituacao = letra('Situação da precificação');

  if (!cIpc) {
    throw new Error(
      'A aba "' + ABA_DADOS + '" ainda não tem as colunas do modelo. ' +
      'Elas aparecem no primeiro formulário concluído depois de o Avaliacao.gs ser implantado.',
    );
  }

  var painel = ss.getSheetByName(ABA_PAINEL);
  if (painel) {
    painel.clear();
  } else {
    painel = ss.insertSheet(ABA_PAINEL, 0);
  }

  /**
   * Separador de argumentos das fórmulas.
   * Planilha em português usa ponto e vírgula; em inglês, vírgula. Escrever
   * com o separador errado gera "erro de análise de fórmula" em toda célula
   * com mais de um argumento.
   */
  var idioma = String(ss.getSpreadsheetLocale() || '');
  var sep = idioma.indexOf('en') === 0 ? ',' : ';';

  var aba = "'" + ABA_DADOS + "'!";
  var faixa = function (coluna) {
    return aba + coluna + '2:' + coluna;
  };
  var concluido = faixa(cStatus) + sep + '"Concluído"';

  // ── Cabeçalho ──
  painel.getRange('A1').setValue('Painel de oportunidades — Diagnóstico Cosmmus');
  painel.getRange('A2').setValue('Atualiza sozinho a cada nova resposta. Os valores são referência interna, nunca preço final.');

  // ── Indicadores ──
  var indicadores = [
    ['Indicador', 'Valor'],
    ['Formulários iniciados', '=COUNTA(' + faixa(cProtocolo) + ')'],
    ['Formulários concluídos', '=COUNTIF(' + concluido + ')'],
    ['Abandonados no meio', '=COUNTA(' + faixa(cProtocolo) + ')-COUNTIF(' + concluido + ')'],
    ['IPC médio', '=IFERROR(ROUND(AVERAGEIF(' + concluido + sep + faixa(cIpc) + ')' + sep + '1)' + sep + '"—")'],
    ['Funil — piso somado', '=SUMIF(' + concluido + sep + faixa(cMin) + ')'],
    ['Funil — teto somado', '=SUMIF(' + concluido + sep + faixa(cMax) + ')'],
    ['Aguardando revisão humana', '=COUNTIF(' + faixa(cSituacao) + sep + '"Aguardando revisão humana")'],
  ];
  painel.getRange(4, 1, indicadores.length, 2).setValues(indicadores);
  painel.getRange(9, 2, 2, 1).setNumberFormat('R$ #,##0');

  // ── Distribuição por nível ──
  var niveis = [
    'Nível I | Essencial',
    'Nível II | Estruturado',
    'Nível III | Amplo',
    'Nível IV | Alta Complexidade',
  ];
  var distribuicao = [['Nível de complexidade', 'Quantidade', 'Piso somado', 'Teto somado']];
  for (var n = 0; n < niveis.length; n++) {
    distribuicao.push([
      niveis[n],
      '=COUNTIF(' + faixa(cNivel) + sep + '"' + niveis[n] + '")',
      '=SUMIF(' + faixa(cNivel) + sep + '"' + niveis[n] + '"' + sep + faixa(cMin) + ')',
      '=SUMIF(' + faixa(cNivel) + sep + '"' + niveis[n] + '"' + sep + faixa(cMax) + ')',
    ]);
  }
  var linhaDist = 4 + indicadores.length + 1;
  painel.getRange(linhaDist, 1, distribuicao.length, 4).setValues(distribuicao);
  painel.getRange(linhaDist + 1, 3, niveis.length, 2).setNumberFormat('R$ #,##0');

  // ── Alertas ──
  var alertas = [
    'Alerta financeiro',
    'Alerta de tecnologia e dados',
    'Alerta documental',
    'Alerta de urgência',
    'Alerta de escopo',
    'Alerta de disponibilidade',
    'Sem alerta crítico',
  ];
  var tabelaAlertas = [['Alerta principal', 'Quantidade']];
  for (var a = 0; a < alertas.length; a++) {
    tabelaAlertas.push([alertas[a], '=COUNTIF(' + faixa(cAlerta) + sep + '"' + alertas[a] + '")']);
  }
  var linhaAlertas = linhaDist + distribuicao.length + 1;
  painel.getRange(linhaAlertas, 1, tabelaAlertas.length, 2).setValues(tabelaAlertas);

  // ── Lista de oportunidades, da mais complexa para a mais simples ──
  var linhaLista = linhaAlertas + tabelaAlertas.length + 1;
  painel.getRange(linhaLista, 1).setValue('Oportunidades concluídas');

  var colunasQuery = [cEmpresa, cSegmento, cCidade, cIpc, cNivel, cMin, cMax, cAlerta, cProtocolo]
    .filter(function (c) { return c; })
    .join(', ');

  var consulta =
    '=IFERROR(QUERY(' + aba + 'A2:' + colunaParaLetra(headers.length) + sep + ' ' +
    '"select ' + colunasQuery + " where " + cStatus + " = 'Concluído' order by " + cIpc + ' desc"' + sep + ' 0)' + sep + ' ' +
    '"Nenhum formulário concluído ainda.")';

  var titulos = ['Empresa', 'Segmento', 'Cidade', 'IPC', 'Nível', 'Piso', 'Teto', 'Alerta', 'Protocolo'];
  if (!cSegmento) titulos.splice(1, 1);
  if (!cCidade) titulos.splice(titulos.indexOf('Cidade'), 1);
  painel.getRange(linhaLista + 1, 1, 1, titulos.length).setValues([titulos]);
  painel.getRange(linhaLista + 2, 1).setFormula(consulta);

  // ── Aparência ──
  painel.getRange('A1').setFontSize(14).setFontWeight('bold');
  painel.getRange('A2').setFontColor('#6b6483').setFontSize(10);
  [4, linhaDist, linhaAlertas, linhaLista + 1].forEach(function (linha) {
    painel.getRange(linha, 1, 1, 4).setFontWeight('bold').setBackground('#120b24').setFontColor('#ffffff');
  });
  painel.getRange(linhaLista, 1).setFontWeight('bold');
  painel.setColumnWidth(1, 260);
  painel.setColumnWidths(2, 8, 130);
  painel.setFrozenRows(2);

  SpreadsheetApp.getActive().toast('Painel atualizado.', 'COSMMUS', 5);
}

/** Coloca "Atualizar painel" no menu da planilha, para não depender do editor. */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('COSMMUS')
    .addItem('Atualizar painel', 'criarPainel')
    .addItem('Recalcular respostas', 'recalcularRespostas')
    .addToUi();
}
