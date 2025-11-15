import memjs from "memjs"

const client = memjs.Client.create()
client.get("birthday_db", function(err, db) {
  if (typeof db === "undefined" || db === null || db.length === 0) {
    console.error("no db")
    return
  }
  db.forEach(function(birthday: any) {
    console.log(birthday.congratulations + "\n")
  })
})
