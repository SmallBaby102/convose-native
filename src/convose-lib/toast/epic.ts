import { AnyAction } from "redux"
import { combineEpics, Epic, ofType } from "redux-observable"
import { delay, mapTo } from "rxjs/operators"

import { ToastAction, ToastActionType } from "./actions"

const TOAST_TIME_SHOW = 5000

export const showToastEpic: Epic<AnyAction, AnyAction> = (action$) =>
  action$.pipe(
    ofType(ToastActionType.ShowToast),
    delay(TOAST_TIME_SHOW),
    mapTo(ToastAction.hideToast())
  )

export const toastEpic = combineEpics(showToastEpic)
