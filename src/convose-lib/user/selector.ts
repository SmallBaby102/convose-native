// eslint-disable-next-line import/no-extraneous-dependencies
import { createSelector } from "reselect"

import { State } from "convose-lib/store"

export const selectUserFeature = (state: State) => state.user
export const selectToken = createSelector(
  selectUserFeature,
  (user) => user.authentication_token
)
export const selectMyUuid = createSelector(
  selectUserFeature,
  (user) => user.uuid
)
export const selectMyId = createSelector(selectUserFeature, (user) => user.id)
export const selectMyUsername = createSelector(
  selectUserFeature,
  (user) => user.username
)
export const selectUserInterests = createSelector(
  selectUserFeature,
  (user) => user.interests
)
export const selectUserLocalInterests = createSelector(
  selectUserFeature,
  (user) => user.localInterests
)
export const selectUserActive = createSelector(
  selectUserFeature,
  (user) => user.userActive
)
export const selectIsGuest = createSelector(
  selectUserFeature,
  (user) => user.is_guest
)
export const selectSocialLoginType = createSelector(
  selectUserFeature,
  (user) => user.socialLoginType
)
export const selectExpoPushToken = createSelector(
  selectUserFeature,
  (user) => user.expoPushToken
)
export const selectIsGettingExpoPushToken = createSelector(
  selectUserFeature,
  (user) => user.isGettingExpoPushToken
)
