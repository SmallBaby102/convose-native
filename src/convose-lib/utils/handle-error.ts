/* eslint-disable import/no-extraneous-dependencies */
import { Observable, of } from "rxjs"
import { AjaxError } from "rxjs/ajax"

import { ToastAction, ToastType } from "convose-lib/toast"

export const handleRequestError = (
  error: AjaxError
): Observable<ToastAction> => {
  const message =
    error && error.response && error.response.error
      ? error.response.error
      : "Failed to make the request, please try again"
  return of(
    ToastAction.showToast({
      message,
      type: ToastType.error,
    })
  )
}
