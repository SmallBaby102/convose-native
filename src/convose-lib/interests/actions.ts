/* eslint-disable @typescript-eslint/explicit-module-boundary-types, import/no-extraneous-dependencies */
import { AjaxError } from "rxjs/ajax"

import { Interest } from "convose-lib/interests"
import { ActionsUnion, createAction } from "../utils/action"
import { UserInterest } from "./dto"

export const LIMIT_OF_INTERESTS = 30
export const DEFAULT_FROM = 0

export enum InterestsActionType {
  ClearInterestsResults = "[Interests] Clear interest results ",
  SearchInterests = "[Interests] Search interests",
  SearchInterestsFailure = "[Interests] Search interests - failure",
  SearchInterestsSuccess = "[Interests] Search interests - success",
  AddNewInterestSuccess = "[Interests] Add new interest",
  AddNewInterestWithLevel = "[Interests] Add new interest with level",
  ClearNewInterest = "[Interests] Clear new interest",
  RemoveInterestSuccess = "[Interest] Remove interest - success",
}

export const InterestsAction = {
  clearInterestsResults: () =>
    createAction(InterestsActionType.ClearInterestsResults),
  searchInterests: (text: string) =>
    createAction(InterestsActionType.SearchInterests, { text }),
  searchInterestsFailure: (payload: AjaxError) =>
    createAction(InterestsActionType.SearchInterestsFailure, payload),
  searchInterestsSuccess: (interests: ReadonlyArray<Interest>, text: string) =>
    createAction(InterestsActionType.SearchInterestsSuccess, {
      interests,
      text,
    }),
  addNewInterestSuccess: (interest: UserInterest) =>
    createAction(InterestsActionType.AddNewInterestSuccess, interest),
  removeInterestSuccess: (interest: UserInterest) =>
    createAction(InterestsActionType.RemoveInterestSuccess, interest),
  clearNewInterest: () => createAction(InterestsActionType.ClearNewInterest),
  addNewInterestWithLevel: (interest: UserInterest) =>
    createAction(InterestsActionType.AddNewInterestWithLevel, interest),
}

export type InterestsAction = ActionsUnion<typeof InterestsAction>
