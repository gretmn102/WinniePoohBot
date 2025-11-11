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

export type Birthday = { day: number, month: Month }

export namespace Birthday {
  export function tryParse(input: string): Result<Birthday, string> {
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
  birthday: Birthday
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
      [`${sheetTitle}!A:B`],
      "ROWS",
    )
  } catch (err) {
    console.error(err)
  }
  if (!response) { throw new Error("Response is null") }
  const valueRanges = response.valueRanges
  if (valueRanges.length === 0) {
    throw new Error("valueRanges length is null")
  }

  const db: Db = valueRanges[0]
    .values
    .map(([rawBirthday, congratulations]) => {
      const birthdayResult = Birthday.tryParse(rawBirthday)
      if (birthdayResult[0] === "Error") {
        throw new Error(`Error parse ${rawBirthday}: ${birthdayResult[1]}`)
      }
      return { birthday: birthdayResult[1], congratulations }
    })

  return db
}
