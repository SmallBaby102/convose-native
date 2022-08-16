export function getRatio(defaultHeight: number, defaultWidth: number): number {
  return defaultHeight / defaultWidth
}
export function getWidth(ratio: number, height: number): number {
  return height / ratio
}
