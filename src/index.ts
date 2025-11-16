import TelegramBot from "node-telegram-bot-api"
import config from "./config"
import { BirthdayCongratulation, loadDb, BirthdayType } from "./db"
import { getSheetTitles } from "./googleSheetApi"
import fs from "node:fs"
import generate_text from "./generate_text"

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
  if (!fs.existsSync("birthday_db.json")) {
    console.error("no db file")
    return
  }
  const db_text = fs.readFileSync("birthday_db.json").toString()
  if (typeof db_text === "undefined" || db_text === null || db_text.length === 0) {
    console.error("no db")
    return
  }
  const db = JSON.parse(db_text)
  console.log("Загрузка успешно завершена.")

  const now = new Date()
  const day = now.getDate()
  const month = now.getMonth()
  if (fs.existsSync("last_congrats.txt")) {
    const lastCongrats = fs.readFileSync("last_congrats.txt").toString()
    if (lastCongrats === ("" + day + month)) {
      console.log("Сегодня мы уже проверяли поздравления.")
      return
    }
  }

  const congrats = db.filter((row: any) => (
    row.birthday.day == day && row.birthday.month == month
  ))
  if (congrats.length === 0) {
    console.log("Похоже, сегодня некого поздравлять.")
    return
  }

  let error = false
  congrats
    .forEach((congrat: any) => {
      const congratString = BirthdayCongratulation.toString(congrat)
      console.log(`Поздравляю ${congratString}...`)
      bot.sendMessage(chatId, generate_text(congrat))
        .then(() => {
          console.log(`Поздравил ${congratString}!`)
        })
        .catch(err => {
          console.error(`Не смог поздравить ${congratString} по следующей причине: ${err}`)
          error = true
        })
    })
  if (error === false) {
    fs.writeFileSync("last_congrats.txt", "" + day + month)
  }
}

const TELEGRAM_BOT_TOKEN = config.telegramBotToken

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("Please, add TELEGRAM_BOT_TOKEN in .env")
}

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN)

const CHAT_ID = config.chatId

if (!CHAT_ID) {
  console.log("Переменная окружения CHAT_ID не определена, так что включается режим polling.")
  console.log("Подождите, пока запустится бот.")
  startPolling(bot)
} else {
  void startCongratulating(CHAT_ID)
}
