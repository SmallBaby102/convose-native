import { createSelector } from "reselect"

import { State } from "convose-lib/store"
import { AppState } from "."

export const selectAppFeature = (state: State): AppState => state.app

export const selectIsAppLoading = createSelector(
  selectAppFeature,
  (app) => app.showSplash
)

export const selectIsDarkMode = createSelector(
  selectAppFeature,
  (app) => app.setting.darkMode
)

export const selectIsFayeReady = createSelector(
  selectAppFeature,
  (app) => app.isFayeReady
)
