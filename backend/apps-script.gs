/**
 * Google Apps Script Web App — kadastr yozuvlari uchun backend.
 *
 * Deploy: Deploy → New deployment → Type: Web app
 *   - Execute as: Me
 *   - Who has access: Anyone
 * Har o'zgarishdan keyin qayta deploy qiling (yoki "Manage deployments" da versiyani yangilang).
 *
 * Ustunlar (A, B): landCadastralNumber | cadastralNumber
 */

// ⬇️ SHU YERGA spreadsheet ID sini qo'ying (URL dan oling):
// https://docs.google.com/spreadsheets/d/<<<SPREADSHEET_ID>>>/edit
// "/d/" va "/edit" orasidagi uzun matn — o'sha ID.
const SPREADSHEET_ID = "BU_YERGA_SPREADSHEET_ID";

const SHEET_NAME = "Sheet1";
const HEADERS = ["landCadastralNumber", "cadastralNumber"];

/**
 * Varaqni ishonchli oladi (null bo'lishi mumkin emas):
 *  - Spreadsheet'ni ID bo'yicha ochadi (standalone yoki bound — ikkalasida ishlaydi)
 *  - SHEET_NAME topilmasa → birinchi varaq → u ham yo'q bo'lsa yangi yaratadi
 *  - Sarlavha (header) qatorini kafolatlaydi
 */
function getSheet_() {
  const ss =
    SPREADSHEET_ID && SPREADSHEET_ID !== "BU_YERGA_SPREADSHEET_ID"
      ? SpreadsheetApp.openById(SPREADSHEET_ID)
      : SpreadsheetApp.getActiveSpreadsheet();

  if (!ss) {
    throw new Error(
      "Spreadsheet topilmadi — SPREADSHEET_ID ni to'ldiring (standalone skript)",
    );
  }

  let sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }
  return sheet;
}

/** GET → barcha saqlangan yozuvlar ro'yxati (JSON massiv). */
function doGet() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  const records = [];

  if (lastRow > 1) {
    const values = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
    values.forEach(function (row) {
      records.push({
        landCadastralNumber: String(row[0]),
        cadastralNumber: String(row[1]),
      });
    });
  }

  return jsonOutput_(records);
}

/** POST → yangi yozuv qo'shadi. Body: {landCadastralNumber, cadastralNumber} (text/plain). */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const land = (body.landCadastralNumber || "").toString().trim();
    const cad = (body.cadastralNumber || "").toString().trim();

    if (!land || !cad) {
      return jsonOutput_({
        success: false,
        error: "landCadastralNumber va cadastralNumber majburiy",
      });
    }

    const sheet = getSheet_();
    sheet.appendRow([land, cad]);

    return jsonOutput_({ success: true, landCadastralNumber: land, cadastralNumber: cad });
  } catch (err) {
    return jsonOutput_({ success: false, error: String(err) });
  }
}

/** JSON javob qaytaruvchi yordamchi. */
function jsonOutput_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON,
  );
}
