/* eslint-disable import/no-extraneous-dependencies */
import { uniqBy } from "lodash"
import { User } from "../dto"
import { UserState } from "../state"

export function updateUserSuccess(state: UserState, payload: User): UserState {
  const interest = Array.from(payload.interests)
  const newPayload: User = {
    ...payload,
    interests: interest.reverse(),
  }
  return {
    ...state,
    ...newPayload,
    updating_avatar: false,
  }
}
export function updateUserRequest(
  state: UserState,
  payload: Partial<User>
): UserState {
  const localInterests = (() => {
    if (payload.interests) {
      return uniqBy(payload.interests, "name")
    }
    return state.localInterests
  })()
  return {
    ...state,
    localInterests,
  }
}
