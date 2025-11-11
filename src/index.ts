import TelegramBot from "node-telegram-bot-api"
import dotenv from "dotenv"
import { loadDb } from "./db"

dotenv.config()

const token = process.env.TOKEN

if (!token) {
  throw new Error("Please, add TOKEN in .env")
}

const bot = new TelegramBot(token)

bot.onText(/\/start/, async msg => {
  await bot.sendMessage(msg.chat.id, `ID чата: ${msg.chat.id}`)
})

// ['ready' event ? #801](https://github.com/yagop/node-telegram-bot-api/issues/801)
bot.startPolling()
  .then(() => {
    console.log("Bot is ready!")
  })
  .catch(err => {
    console.error(`Error: ${err}`)
  })

bot.on("polling_error", (error) => {
  console.error("Polling error:", error)
})

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
if (!GOOGLE_API_KEY) {
  throw new Error("Please, add GOOGLE_API_KEY in .env")
}

const SPREADSHEET_ID = process.env.SPREADSHEET_ID
if (!SPREADSHEET_ID) {
  throw new Error("Please, add SPREADSHEET_ID in .env")
}

const SHEET_TITLE = process.env.SHEET_TITLE
if (!SHEET_TITLE) {
  throw new Error("Please, add SHEET_TITLE in .env")
}

loadDb(GOOGLE_API_KEY, SPREADSHEET_ID, SHEET_TITLE)
  .then(res => {
    console.log(JSON.stringify(res, undefined, 2))
  })
  .catch(err => {
    console.error(err)
  })
