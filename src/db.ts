import { Result } from "@fering-org/functional-helper"

import { getBatchValues } from "./googleSheetApi"

export enum Month {
  January,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December,
}

export type BirthdayType = { day: number, month: Month }

export namespace Birthday {
  export function tryParse(input: string): Result<BirthdayType, string> {
    const pattern = /(\d+)\s*([а-яА-Я]+)/
    const result = pattern.exec(input)
    if (!result) {
      return Result.mkError(`could not parse by ${pattern}`)
    }
    const rawDay = result[1]

    const day = Number(rawDay)
    if (!(1 <= day && day <= 31)) {
      return Result.mkError("day must be 1<=day<=31")
    }

    const monthMap: Record<string, number> = {
      "января": Month.January,
      "февраля": Month.February,
      "марта": Month.March,
      "апреля": Month.April,
      "мая": Month.May,
      "июня": Month.June,
      "июля": Month.July,
      "августа": Month.August,
      "сентября": Month.September,
      "октября": Month.October,
      "ноября": Month.November,
      "декабря": Month.December,
    }
    const monthName = result[2]
    const month = monthMap[monthName]
    if (month === undefined) {
      return Result.mkError("month parser error")
    }
    return Result.mkOk({ day, month })
  }
}

export type BirthdayCongratulation = {
  birthday: BirthdayType
  congratulations: string
}

export namespace BirthdayCongratulation {
  export function toString(birthdayCongrat: BirthdayCongratulation) {
    return JSON.stringify(birthdayCongrat)
  }
}

export type Db = BirthdayCongratulation[]

export async function loadDb(
  googleApiKey: string,
  spreadSheetId: string,
  sheetTitle: string
) {
  let response
  try {
    response = await getBatchValues(
      googleApiKey,
      spreadSheetId,
      [`${sheetTitle}!A:C`],
      "ROWS",
    )
  } catch (err) {
    throw new Error(`Response error: ${err}`)
  }
  const valueRanges = response.valueRanges
  if (typeof valueRanges === "undefined" || valueRanges.length === 0) {
    throw new Error("valueRanges length is null")
  }
  if (typeof valueRanges[0] === "undefined" || typeof valueRanges[0].values === "undefined") {
    throw new Error("valueRanges[0] is undefined")
  }
  const values = valueRanges[0].values.filter(function(value, index) {
    // Пропускаем строку заголовков.
    return (index > 0)
  })
  if (!values) { return [] }
  const db: Db = values
    .map(([rawBirthday, nicks, congratulations]) => {
      const birthdayResult = Birthday.tryParse(rawBirthday)
      if (birthdayResult[0] === "Error") {
        throw new Error(`Error parse ${rawBirthday}: ${birthdayResult[1]}`)
      }
      return { birthday: birthdayResult[1], nicks, congratulations }
    })

  return db
}
