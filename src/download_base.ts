import dotenv from "dotenv"
import { loadDb } from "./db"
import { getSheetTitles } from "./googleSheetApi"
import fs from "fs"

async function download() {
  dotenv.config()

  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
  if (!GOOGLE_API_KEY) {
    throw new Error("Please, add GOOGLE_API_KEY in .env")
  }

  const SPREADSHEET_ID = process.env.SPREADSHEET_ID
  if (!SPREADSHEET_ID) {
    throw new Error("Please, add SPREADSHEET_ID in .env")
  }

  const SHEET_TITLE = await (async () => {
    const SHEET_TITLE = process.env.SHEET_TITLE
    if (SHEET_TITLE) {
      return SHEET_TITLE
    }
    let response
    try {
      response = await getSheetTitles(GOOGLE_API_KEY, SPREADSHEET_ID)
    } catch (error) {
      throw new Error(`getSheetTitles throw error: ${error}`)
    }
    const sheets = response.sheets
    if (sheets.length === 0) {
      throw new Error("Листы отсутствуют в документе. Создайте хотя бы один лист!")
    }
    return sheets[0].properties.title
  })()

  let db
  try {
    db = await loadDb(GOOGLE_API_KEY, SPREADSHEET_ID, SHEET_TITLE)
    fs.writeFileSync("birthday_db.json", JSON.stringify(db))
  } catch (error) {
    throw new Error(`Error DB loading: ${error}`)
  }
}
download().catch(function(e) {
  console.error(e)
})
