import fs from "node:fs"

let db = fs.readFileSync("birthday_db.json").toString()
if (typeof db === "undefined" || db === null || db.length === 0) {
  console.error("no db")
  process.exit()
}
db = JSON.parse(db)
db.forEach(function(birthday: any) {
  console.log(birthday.congratulations)
})
