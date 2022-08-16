// eslint-disable-next-line import/no-extraneous-dependencies
import { createSelector } from "reselect"

import { State } from "convose-lib/store"
import { selectMyUuid } from "convose-lib/user"
import { CallingState } from "."

export const selectCallingFeature = (state: State): CallingState =>
  state.calling

export const selectAudioSetting = createSelector(
  selectCallingFeature,
  (calling) => calling.audioSetting
)
export const selectCallingChannel = createSelector(
  selectCallingFeature,
  (calling) => calling.callingChannel
)
export const selectCallingChatId = createSelector(
  selectCallingFeature,
  (calling) => calling.chatId
)

export const selectIsCalling = createSelector(
  selectCallingFeature,
  (calling) => calling.isCalling
)

export const selectPeers = createSelector(
  selectCallingFeature,
  (calling) => calling.peers
)

export const selectIsHost = createSelector(
  selectCallingFeature,
  (calling) => calling.isHost
)

export const selectIsGroup = createSelector(
  selectCallingFeature,
  (calling) => calling.isGroup
)

export const selectJoinCall = createSelector(
  selectCallingFeature,
  (calling) => calling.joinCall
)

export const selectDisplayText = createSelector(
  selectCallingFeature,
  (calling) => calling.displayText
)

export const selectCallerUuid = createSelector(
  selectCallingFeature,
  (calling) => calling.caller
)

export const selectIsCaller = createSelector(
  selectCallingFeature,
  (state: State) => selectMyUuid(state),
  (calling, myUuid) => calling.caller === myUuid
)

export const selectActivePeer = createSelector(
  selectCallingFeature,
  (calling) => calling.activePeer
)

export const selectCallingDisplayText = createSelector(
  selectCallingFeature,
  (calling) => calling.displayText
)
