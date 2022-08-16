import { createSelector } from "reselect"

import { State } from "convose-lib/store"
import { InterestsState } from "."

export const selectInterestFeature = (state: State): InterestsState =>
  state.interests

export const selectSearchResults = createSelector(
  selectInterestFeature,
  (interest) => interest.searchResults
)
export const selectSearchText = createSelector(
  selectInterestFeature,
  (interest) => interest.searchText
)
export const selectHasMore = createSelector(
  selectInterestFeature,
  (interest) => interest.hasMore
)
export const selectFrom = createSelector(
  selectInterestFeature,
  (interest) => interest.from
)
