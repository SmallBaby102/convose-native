import { AutoSuggestInterest, UserInterest } from "./dto"

export interface InterestsState {
  readonly searchResults: ReadonlyArray<AutoSuggestInterest> | []
  readonly newInterest: UserInterest
  readonly showPopup: boolean
  readonly searchText: string
  readonly hasMore: boolean
  readonly from: number
}
