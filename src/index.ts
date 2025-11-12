import TelegramBot from "node-telegram-bot-api"
import dotenv from "dotenv"
import { BirthdayCongratulation, loadDb } from "./db"
import { getSheetTitles } from "./googleSheetApi"

function startPolling(bot: TelegramBot) {
  bot.onText(/\/start/, async msg => {
    await bot.sendMessage(msg.chat.id, `ID чата: ${msg.chat.id}`)
  })

  // ['ready' event ? #801](https://github.com/yagop/node-telegram-bot-api/issues/801)
  bot.startPolling()
    .then(() => {
      console.log("Бот запущен.")
      console.log("Наберите /start в интересующем вас в чате, чтобы получить идентификатор.")
    })
    .catch(err => {
      console.error(`Error: ${err}`)
    })

  bot.on("polling_error", (error) => {
    console.error("Polling error:", error)
  })
}

async function startCongratulating(chatId: string) {
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

  console.log(`Загружается база данных из ${SHEET_TITLE}...`)
  let db
  try {
    db = await loadDb(GOOGLE_API_KEY, SPREADSHEET_ID, SHEET_TITLE)
  } catch (error) {
    throw new Error(`Error DB loading: ${error}`)
  }

  console.log("Загрузка успешно завершена.")

  const now = new Date()
  const day = now.getDate()
  const month = now.getMonth()

  const congrats = db.filter(({ birthday }) => (
    birthday.day === day && birthday.month == month
  ))
  if (congrats.length === 0) {
    console.log("Похоже, сегодня некого поздравлять.")
    return
  }

  congrats
    .forEach(congrat => {
      const congratString = BirthdayCongratulation.toString(congrat)
      console.log(`Поздравляю ${congratString}...`)
      bot.sendMessage(chatId, congrat.congratulations)
        .then(() => {
          console.log(`Поздравил ${congratString}!`)
        })
        .catch(err => {
          console.error(`Не смог поздравить ${congratString} по следующей причине: ${err}`)
        })
    })
}

dotenv.config()

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("Please, add TELEGRAM_BOT_TOKEN in .env")
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN)

const CHAT_ID = process.env.CHAT_ID

if (!CHAT_ID) {
  console.log("Переменная окружения CHAT_ID не определена, так что включается режим polling.")
  console.log("Подождите, пока запустится бот.")
  startPolling(bot)
} else {
  void startCongratulating(CHAT_ID)
}
