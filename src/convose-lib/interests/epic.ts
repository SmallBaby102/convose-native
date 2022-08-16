/* eslint-disable import/no-extraneous-dependencies */
import { AnyAction } from "redux"
import { combineEpics, Epic, ofType } from "redux-observable"
import { of } from "rxjs"
import {
  catchError,
  delay,
  map,
  switchMap,
  withLatestFrom,
} from "rxjs/operators"

import { State } from "../store"
import { InterestsAction, InterestsActionType } from "./actions"
import { searchInterests } from "./dao"

export const searchInterestsEpic: Epic<AnyAction, InterestsAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(InterestsActionType.SearchInterests),
    withLatestFrom(state$),
    switchMap(([{ payload }, { user, interests }]) => {
      return searchInterests(
        user.authentication_token,
        payload.text,
        undefined,
        interests.from
      ).pipe(
        map((res) => {
          return InterestsAction.searchInterestsSuccess(res, payload.text)
        }),
        catchError((error) => of(InterestsAction.searchInterestsFailure(error)))
      )
    })
  )

export const clearNewInterestsEpic: Epic<AnyAction, InterestsAction, State> = (
  action$,
  _
) =>
  action$.pipe(
    ofType(
      InterestsActionType.AddNewInterestSuccess,
      InterestsActionType.AddNewInterestWithLevel
    ),
    delay(2500),
    map(() => InterestsAction.clearNewInterest())
  )

export const interestsEpic = combineEpics(
  searchInterestsEpic,
  clearNewInterestsEpic
)
