import { LIMIT_OF_INTERESTS } from "../actions"
import { SearchInterestsResultType, UserInterest } from "../dto"
import { InterestsState } from "../state"

export function updateSearchInterests(
  state: InterestsState,
  payload: SearchInterestsResultType
): InterestsState {
  return {
    ...state,
    searchResults:
      state.searchText === payload.text
        ? [...state.searchResults, ...payload.interests]
        : payload.interests,
    from: state.from + payload.interests.length,
    hasMore:
      !!payload.interests.length ||
      !(payload.interests.length < LIMIT_OF_INTERESTS),
    searchText:
      state.searchText === payload.text ? state.searchText : payload.text,
  }
}
export function updateAddNewInterest(
  state: InterestsState,
  payload: UserInterest
): InterestsState {
  return {
    ...state,
    searchResults: state.searchResults.map((interest) =>
      interest.name === payload.name
        ? { ...interest, existing: true }
        : interest
    ),
    newInterest: payload,
    showPopup: true,
  }
}
export function updateRemoveInterest(
  state: InterestsState,
  payload: UserInterest
): InterestsState {
  return {
    ...state,
    searchResults: state.searchResults.map((interest) =>
      interest.name === payload.name
        ? { ...interest, existing: false }
        : interest
    ),
  }
}
