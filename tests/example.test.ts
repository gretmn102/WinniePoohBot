import { Result } from "@fering-org/functional-helper"
import { it, describe, expect } from "vitest"
import { Birthday, Month } from "../src/db"

describe("Birthday.tryParse", () => {
  it("1   июля", () => {
    expect(Birthday.tryParse("1   июля"))
      .toStrictEqual(Result.mkOk({
        day: 1,
        month: Month.July,
      }))
  })
  it("20 июня", () => {
    expect(Birthday.tryParse("20 июня"))
      .toStrictEqual(Result.mkOk({
        day: 20,
        month: Month.June,
      }))
  })
  it("3 декабря", () => {
    expect(Birthday.tryParse("3 декабря"))
      .toStrictEqual(Result.mkOk({
        day: 3,
        month: Month.December,
      }))
  })
  it("6 января", () => {
    expect(Birthday.tryParse("6 января"))
      .toStrictEqual(Result.mkOk({
        day: 6,
        month: Month.January,
      }))
  })
})
