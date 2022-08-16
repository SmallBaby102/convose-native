/* eslint-disable import/no-extraneous-dependencies */
import { createSelector } from "reselect"

import { State } from "convose-lib/store"
import { AuthState } from "."

export const selectAuthFeature = (state: State): AuthState => state.auth
export const selectAuthError = createSelector(
  selectAuthFeature,
  (auth) => auth.authErrorMessage
)
export const selectAuthLoading = createSelector(
  selectAuthFeature,
  (auth) => auth.loading
)
