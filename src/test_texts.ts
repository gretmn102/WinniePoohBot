import fs from "node:fs"
import generate_text from "./generate_text"

const db_text = fs.readFileSync("birthday_db.json").toString()
if (typeof db_text === "undefined" || db_text === null || db_text.length === 0) {
  console.error("no db")
  process.exit()
}
const db = JSON.parse(db_text)
db.forEach(function(birthday: any) {
  console.log(generate_text(birthday))
})
