// eslint-disable-next-line import/no-extraneous-dependencies
import { arc } from "d3-shape"

import { Slice } from "convose-lib/interests"

const CORNER_RADIUS = 4

export const generateSlicePath = (
  { end, start }: Slice,
  radius: number
): string | null => {
  if (end - start === 0) {
    return "M 0 0"
  }

  return arc().cornerRadius(CORNER_RADIUS)({
    endAngle: end + Math.PI / 2,
    innerRadius: radius * 0.45,
    outerRadius: radius,
    startAngle: start + Math.PI / 2,
  })
}
