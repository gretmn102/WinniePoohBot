import fs from "node:fs"

const db = fs.readFileSync("birthday_db.json")
if (typeof db === "undefined" || db === null || db.length === 0) {
  console.error("no db")
  process.exit()
}
db.forEach(function(birthday: any) {
  console.log(birthday.congratulations + "\n")
})
