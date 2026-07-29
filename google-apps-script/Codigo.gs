/**
 * COSMMUS BUSINESS — Recebedor do Formulário de Caracterização Organizacional
 *
 * Cole este código no editor de Apps Script da planilha que vai receber as respostas
 * (Extensões → Apps Script) e implante como "Aplicativo da Web".
 * Passo a passo completo em docs/FORMULARIO-SHEETS.md
 */

/** Nome da aba onde as respostas serão gravadas (criada automaticamente). */
const SHEET_NAME = 'Respostas';

/** Opcional: e-mail que recebe aviso a cada novo envio. Deixe vazio para não notificar. */
const NOTIFY_EMAIL = '';

/**
 * Recebe o POST do site e grava uma linha na planilha.
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

    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(SHEET_NAME);
    }

    // Primeira execução: cria a linha de cabeçalho
    if (sheet.getLastRow() === 0) {
      sheet.getRange(1, 1, 1, incomingHeaders.length).setValues([incomingHeaders]);
      sheet
        .getRange(1, 1, 1, incomingHeaders.length)
        .setFontWeight('bold')
        .setBackground('#120b24')
        .setFontColor('#ffffff')
        .setWrap(true);
      sheet.setFrozenRows(1);
      sheet.setRowHeight(1, 60);
    }

    let headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Perguntas novas viram colunas novas no fim da planilha
    const missing = incomingHeaders.filter(function (header) {
      return headers.indexOf(header) === -1;
    });
    if (missing.length > 0) {
      sheet
        .getRange(1, headers.length + 1, 1, missing.length)
        .setValues([missing])
        .setFontWeight('bold')
        .setBackground('#120b24')
        .setFontColor('#ffffff')
        .setWrap(true);
      headers = headers.concat(missing);
    }

    // Monta a linha na ordem das colunas existentes
    const row = headers.map(function (header) {
      const index = incomingHeaders.indexOf(header);
      return index === -1 ? '' : incomingRow[index];
    });

    sheet.appendRow(row);

    if (NOTIFY_EMAIL) {
      notify(payload);
    }

    return jsonOutput({ result: 'success', protocolo: payload.protocolo || '' });
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

function notify(payload) {
  const identificacao = payload.row && payload.row.length > 3 ? payload.row[2] || payload.row[3] : '';
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: 'Novo formulário de caracterização organizacional — ' + (payload.protocolo || ''),
    body:
      'Um novo formulário foi enviado pelo site.\n\n' +
      'Protocolo: ' + (payload.protocolo || '') + '\n' +
      'Data/hora: ' + (payload.dataHora || '') + '\n' +
      'Organização: ' + identificacao + '\n\n' +
      'Abra a planilha para ver todas as respostas.',
  });
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
