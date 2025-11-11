import TelegramBot from "node-telegram-bot-api"
import dotenv from "dotenv"

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
