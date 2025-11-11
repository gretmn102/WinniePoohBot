import { getBatchValues } from "./googleSheetApi"

export type BirthdayCongratulation = {
  birthday: string
  congratulations: string
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
    .map(([birthday, congratulations]) => (
      { birthday, congratulations }
    ))

  return db
}
