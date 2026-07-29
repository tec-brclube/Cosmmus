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

/** Nome da aba onde as respostas serão gravadas (criada automaticamente). */
const SHEET_NAME = 'Respostas';

/** Opcional: e-mail que recebe aviso quando um formulário é CONCLUÍDO. Vazio = não notifica. */
const NOTIFY_EMAIL = '';

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
    const incomingHeaders = payload.headers || [];
    const incomingRow = payload.row || [];
    const protocolo = payload.protocolo || '';

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
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

    // Monta a linha na ordem das colunas existentes
    const row = headers.map(function (header) {
      const index = incomingHeaders.indexOf(header);
      return index === -1 ? '' : incomingRow[index];
    });

    const existingRow = findRowByProtocol(sheet, headers, protocolo);

    if (existingRow > 0) {
      sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }

    // Notifica apenas quando o formulário é finalizado
    if (NOTIFY_EMAIL && payload.status === 'Concluído') {
      notify(payload, headers, row);
    }

    return jsonOutput({
      result: 'success',
      protocolo: protocolo,
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

function notify(payload, headers, row) {
  const valueOf = function (headerName) {
    const index = headers.indexOf(headerName);
    return index === -1 ? '' : row[index];
  };

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'Formulário concluído — ' + (valueOf('1.2 Nome fantasia') || payload.protocolo || ''),
    body:
      'Um formulário de caracterização organizacional foi CONCLUÍDO.\n\n' +
      'Protocolo: ' + (payload.protocolo || '') + '\n' +
      'Início do preenchimento: ' + (payload.dataHora || '') + '\n' +
      'Razão social: ' + valueOf('1.1 Razão social') + '\n' +
      'Nome fantasia: ' + valueOf('1.2 Nome fantasia') + '\n' +
      'Responsável: ' + valueOf('2.1 Nome completo') + '\n' +
      'E-mail: ' + valueOf('2.4 E-mail profissional') + '\n' +
      'Telefone: ' + valueOf('2.5 Telefone ou WhatsApp') + '\n\n' +
      'Abra a planilha para ver todas as respostas.',
  });
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
