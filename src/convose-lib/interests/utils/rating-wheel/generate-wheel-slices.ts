import { RatingLevel, Slice } from "../../dto"

export const generateWheelSlices = (
  numberOfSlices: number,
  level: RatingLevel
): ReadonlyArray<Slice> =>
  Array(numberOfSlices)
    .fill(0)
    .reduce(
      (accumulator: ReadonlyArray<Slice>, element, index) => [
        ...accumulator,
        {
          active: level > index,
          end: accumulator[index - 1]
            ? accumulator[index - 1].end + (1 / numberOfSlices) * 2 * Math.PI
            : (1 / numberOfSlices) * 2 * Math.PI + (Math.PI * 3) / 2,
          start: accumulator[index - 1]
            ? accumulator[index - 1].end
            : (Math.PI * 3) / 2,
        },
      ],
      []
    )
