/* eslint-disable import/no-extraneous-dependencies */
import { AnyAction } from "redux"
import { combineEpics, Epic, ofType } from "redux-observable"
import { mapTo } from "rxjs/operators"

import { UserAction } from "convose-lib/user"
import { AppType } from "./actions"

export const initializeAppEpic: Epic<AnyAction, AnyAction> = (action$) =>
  action$.pipe(ofType(AppType.InitializeApp), mapTo(UserAction.fetchProfile()))

export const appEpic = combineEpics(initializeAppEpic)
