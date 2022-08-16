const HSP_THRESHOLD = 127.5

const countHsp = (r: number, g: number, b: number): number =>
  Math.sqrt(r ** 2 * 0.299 + b ** 2 * 0.114 + g ** 2 * 0.578)

export const isDark = (color: string): boolean => {
  if (color.match(/^rgb/)) {
    const colors =
      color.match(
        /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/
      ) || []

    return countHsp(+colors[1], +colors[2], +colors[3]) > HSP_THRESHOLD
  }

  const colorsHex = +`0x${color
    .slice(1)
    .replace(color.length < 5 ? /./g : "", "$&$&")}`

  return (
    countHsp(colorsHex >> 16, (colorsHex >> 8) & 255, colorsHex >> 255) >
    HSP_THRESHOLD
  ) 
}
