import { UrlQuery, UrlQueryFragment } from "./lib/urlQuery"

export type MajorDimension = "ROWS" | "COLUMNS"

export type ValueRanges = {
  range: string
  majorDimension: MajorDimension
  values?: string[][]
}

export type BatchValuesResponse = {
  spreadsheetId: string,
  valueRanges: ValueRanges[]
}

export async function getBatchValues(
  apiKey: string,
  spreadSheetId: string,
  ranges: string[],
  majorDimension?: MajorDimension,
) {
  const urlQuery = UrlQuery.build([
    ranges.map(ranges => (
      UrlQueryFragment.create("ranges", ranges)
    )),
    majorDimension ? [
      UrlQueryFragment.create("majorDimension", majorDimension)
    ] : [],
    [UrlQueryFragment.create("key", apiKey)],
  ].flat())

  const urlFragment = [
    "https://sheets.googleapis.com",
    "v4",
    "spreadsheets",
    spreadSheetId,
    "values:batchGet",
  ]
    .join("/")

  const url = `${urlFragment}?${urlQuery}`

  const rawResponse = await fetch(url)
  const response: BatchValuesResponse = await rawResponse.json()
  return response
}

export type SheetTitlesResponse = {
  sheets: {
    properties: {
      title: string
    }
  }[]
}

export async function getSheetTitles(
  apiKey: string,
  spreadSheetId: string,
) {
  const urlQuery = UrlQuery.build([
    UrlQueryFragment.create("fields", "sheets.properties.title"),
    UrlQueryFragment.create("key", apiKey)
  ])

  const urlFragment = [
    "https://sheets.googleapis.com",
    "v4",
    "spreadsheets",
    spreadSheetId,
  ]
    .join("/")

  const url = `${urlFragment}?${urlQuery}`

  const rawResponse = await fetch(url)
  const response: SheetTitlesResponse = await rawResponse.json()
  return response
}
