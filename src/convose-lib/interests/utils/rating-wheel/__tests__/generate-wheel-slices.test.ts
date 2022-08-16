import { generateWheelSlices } from "../"
import { RatingLevel } from "../../../"

describe("generate-wheel-slices", () => {
  const React = require("react")

  it("should return two wheel slices", () => {
    const result = generateWheelSlices(2, RatingLevel.Beginner)

    expect(result).toEqual([
      {
        active: true,
        end: (Math.PI / 2) * 5,
        start: (Math.PI / 2) * 3,
      },
      {
        active: false,
        end: (Math.PI / 2) * 7,
        start: (Math.PI / 2) * 5,
      },
    ])
  })
})
