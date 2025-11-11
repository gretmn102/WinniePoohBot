export type MajorDimension = "ROWS" | "COLUMNS"

export type ValueRanges = {
  range: string
  majorDimension: MajorDimension
  values: string[][]
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
  const urlQuery = [
    ranges.map(ranges => ["ranges", ranges]),
    majorDimension ? [["majorDimension", majorDimension]] : [],
    [["key", apiKey]],
  ]
    .flat()
    .map(keyValue => {
      const [key, value] = keyValue
      return `${key}=${encodeURIComponent(value)}`
    })
    .join("&")

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
