/**
 * Google Apps Script Web App — kadastr yozuvlari uchun backend.
 *
 * Deploy: Deploy → New deployment → Type: Web app
 *   - Execute as: Me
 *   - Who has access: Anyone
 * Har o'zgarishdan keyin qayta deploy qiling (yoki "Manage deployments" da versiyani yangilang).
 *
 * Ustunlar (A, B, C): landCadastralNumber | cadastralNumber | poligon
 */

// ⬇️ SHU YERGA spreadsheet ID sini qo'ying (URL dan oling):
// https://docs.google.com/spreadsheets/d/<<<SPREADSHEET_ID>>>/edit
// "/d/" va "/edit" orasidagi uzun matn — o'sha ID.
const SPREADSHEET_ID = "1S6C9I-FqoC8Afzk1Fp8cnNZTzF7Xhl4Ya9fMQQULxZI";

const SHEET_NAME = "Sheet1";
const HEADERS = ["landCadastralNumber", "cadastralNumber", "poligon"];

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

  // Varaq grid'i HEADERS uzunligidan tor bo'lsa (masalan, eski 2 ustunli
  // varaq) — appendRow() qo'shimcha ustunlarni jimgina tashlab yuboradi.
  // Shu sababli har doim setRow_() (getRange().setValues()) ishlatamiz,
  // u grid'ni avtomatik kengaytiradi.
  if (sheet.getMaxColumns() < HEADERS.length) {
    sheet.insertColumnsAfter(
      sheet.getMaxColumns(),
      HEADERS.length - sheet.getMaxColumns(),
    );
  }

  if (sheet.getLastRow() === 0) {
    setRow_(sheet, 1, HEADERS);
  } else {
    // Eski (poligon ustuni qo'shilishidan oldingi) sarlavha qatorini to'ldirib qo'yamiz.
    const headerRow = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
    if (!headerRow[2]) {
      sheet.getRange(1, 3).setValue(HEADERS[2]);
    }
  }
  return sheet;
}

/** Berilgan qatorga qiymatlarni yozadi; kerak bo'lsa grid'ni avtomatik kengaytiradi. */
function setRow_(sheet, row, values) {
  sheet.getRange(row, 1, 1, values.length).setValues([values]);
}

/** GET → barcha saqlangan yozuvlar ro'yxati (JSON massiv). */
function doGet() {
  const sheet = getSheet_();
  const lastRow = sheet.getLastRow();
  const records = [];

  if (lastRow > 1) {
    const values = sheet.getRange(2, 1, lastRow - 1, 3).getValues();
    values.forEach(function (row) {
      records.push({
        landCadastralNumber: String(row[0]),
        cadastralNumber: String(row[1]),
        poligon: row[2] ? String(row[2]) : "",
      });
    });
  }

  return jsonOutput_(records);
}

/** POST → yangi yozuv qo'shadi. Body: {landCadastralNumber, cadastralNumber, poligon?} (text/plain). */
function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const land = (body.landCadastralNumber || "").toString().trim();
    const cad = (body.cadastralNumber || "").toString().trim();
    const poligon = (body.poligon || "").toString();

    if (!land || !cad) {
      return jsonOutput_({
        success: false,
        error: "landCadastralNumber va cadastralNumber majburiy",
      });
    }

    const sheet = getSheet_();
    setRow_(sheet, sheet.getLastRow() + 1, [land, cad, poligon]);

    return jsonOutput_({
      success: true,
      landCadastralNumber: land,
      cadastralNumber: cad,
      poligon: poligon,
    });
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
