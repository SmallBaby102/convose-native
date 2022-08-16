import { InterestsAction, InterestsActionType } from "./actions"
import { InterestType } from "./dto"
import { InterestsState } from "./state"
import {
  updateAddNewInterest,
  updateRemoveInterest,
  updateSearchInterests,
} from "./utils"

export const InterestsInitial: InterestsState = {
  searchResults: [],
  newInterest: { level: 0, name: "null", type: InterestType.General },
  showPopup: false,
  searchText: "",
  hasMore: true,
  from: 0,
}

export const interestsReducer = (
  state: InterestsState = InterestsInitial,
  action: InterestsAction
): InterestsState => {
  switch (action.type) {
    case InterestsActionType.AddNewInterestSuccess:
      return updateAddNewInterest(state, action.payload)
    case InterestsActionType.AddNewInterestWithLevel:
      return updateAddNewInterest(state, action.payload)
    case InterestsActionType.ClearNewInterest:
      return {
        ...state,
        showPopup: false,
      }
    case InterestsActionType.SearchInterests:
      return {
        ...state,
        from: state.searchText === action.payload.text ? state.from : 0,
      }
    case InterestsActionType.SearchInterestsSuccess:
      return updateSearchInterests(state, action.payload)

    case InterestsActionType.ClearInterestsResults:
      return {
        ...state,
        searchResults: [],
        from: 0,
        hasMore: true,
        searchText: "",
      }
    case InterestsActionType.RemoveInterestSuccess:
      return updateRemoveInterest(state, action.payload)
    default:
      return state
  }
}
