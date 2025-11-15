export default function(birthday: any): string {
  if (typeof birthday.congratulations !== "undefined" && birthday.congratulations.length > 0) {
    return birthday.congratulations
  } else {
    if (typeof birthday.nicks !== "undefined" && birthday.nicks.length > 0) {
      const amount = birthday.nicks.search(",")
      if (amount > 1) {
        return "Сегодня день рождения отмечает: " + birthday.nicks + "."
      } else {
        return "Сегодня день рождения отмечают:" + birthday.nicks + "."
      }
    }
  }
  return ""
}
