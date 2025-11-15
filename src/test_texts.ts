import fs from "node:fs"

let db = fs.readFileSync("birthday_db.json").toString()
if (typeof db === "undefined" || db === null || db.length === 0) {
  console.error("no db")
  process.exit()
}
db = JSON.parse(db)
db.forEach(function(birthday: any) {
  if (typeof birthday.congratulations !== "undefined" && birthday.congratulations.length > 0) {
    console.log(birthday.congratulations)
  } else {
    if (typeof birthday.nicks !== "undefined" && birthday.nicks.length > 0) {
      console.log(birthday.nicks)
    }
  }
})
