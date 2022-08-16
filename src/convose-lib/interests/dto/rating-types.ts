export const NUMBER_OF_SLICES = 5

export enum RatingLevel {
  None = 0,
  Beginner = 1,
  Novice = 2,
  Intermediate = 3,
  Advanced = 4,
  Expert = 5,
}

export type Slice = {
  readonly end: number
  readonly start: number
  readonly active?: boolean
}

export type WheelColors = {
  readonly active: string
  readonly inactive: string
  readonly stroke: string
}
