import { RatingLevel } from "./rating-types"

export enum InterestType {
  General = "general",
  Language = "language",
}

export type Interest = {
  readonly match: number
  readonly name: string
  readonly type: InterestType
}
export type AutoSuggestInterest = Interest & { readonly existing?: boolean }

export enum InterestLocation {
  Chatbox = "chatbox",
  ChatScreen = "chatscreen",
  MyInterests = "myinterests",
  Popup = "popup",
  CallingScreen = "CallingScreen",
}

export type UserInterest = {
  readonly level: RatingLevel | null
  readonly name: string
  readonly type: InterestType
}

export const interestToUserInterest = ({
  match,
  ...interest
}: Interest): UserInterest => ({
  ...interest,
  level: 0,
})

export type SearchInterestsResultType = {
  interests: ReadonlyArray<Interest>
  text: string
}
