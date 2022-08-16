/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-nested-ternary */
/* eslint-disable complexity */
import { AnyAction } from "redux"
import { combineEpics, Epic, ofType } from "redux-observable"
import { from } from "rxjs"
import { delay, filter, map, mergeMap, withLatestFrom } from "rxjs/operators"

import {
  ChatAction,
  ChatActionType,
  ChatSummary,
  MessageType,
} from "convose-lib/chat"
import { selectMyId, selectMyUuid } from "convose-lib/user"
import { quickUuid } from "convose-lib/utils"
import { Audio } from "expo-av"

import {
  joinCallChannel,
  leaveCallingChannel,
  toggleAudio,
  toggleVideo,
} from "convose-lib/services/agora"
import {
  selectAudioSetting,
  selectCallerUuid,
  selectCallingChannel,
  selectCallingChatId,
  selectIsCalling,
  selectIsGroup,
  selectIsHost,
  selectJoinCall,
} from "./selector"
import { CallDisplayText, CallSignal } from "./dto"
import { CallingAction, CallingActionType } from "./actions"
import { State } from "../store"

const DELAY_END_CALL_TIME = 400
export const serveCallingNotificationsEpic: Epic<
  AnyAction,
  AnyAction,
  State
> = (action$, state$) =>
  action$.pipe(
    ofType(
      ChatActionType.ServeNotifications,
      ChatActionType.ServeSubscriptionMessage
    ),
    withLatestFrom(state$),
    mergeMap(([action, state]) => {
      const myUuid = selectMyUuid(state)
      const myId = selectMyId(state)
      const isCalling = selectIsCalling(state)
      const chatId = selectCallingChatId(state)
      const isGroup = selectIsGroup(state)
      const { isJoined } = selectJoinCall(state)
      const { isAudioEnabled } = selectAudioSetting(state)
      const { isVideoEnabled } = selectAudioSetting(state)
      const { payload } = action
      const chats =
        action.type === ChatActionType.ServeSubscriptionMessage
          ? [payload]
          : payload.chat
      const callingNotifications: ArrayLike<any> = chats
        .filter((chat: ChatSummary | any) =>
          chat.last_message
            ? chat.last_message.message_type === MessageType.Call
            : chat.message.type === MessageType.Call
        )
        .flatMap((chat: ChatSummary | any) => {
          const unifiedChat =
            action.type !== ChatActionType.ServeSubscriptionMessage
              ? chat
              : {
                  channel: chat.chatChannel,
                  last_message: {
                    content: chat.message.data,
                    action: chat.message.action,
                    sender_uuid: chat.message.sender,
                    sender_username: chat.message.senderUsername,
                  },
                  type: chat.chatChannel.length < 88 ? "group" : "onetoone",
                }
          const isBusy = isCalling && chatId !== unifiedChat.channel
          const leaveSignal =
            chatId === unifiedChat.channel &&
            unifiedChat.last_message.sender_uuid !== myUuid &&
            ((!isGroup &&
              unifiedChat.last_message.action === CallSignal.endCall) ||
              unifiedChat.last_message.action === CallSignal.callEndNoAnswer)
          if (unifiedChat.last_message.action === CallSignal.call) {
            if (isBusy) {
              const endCallMessage = {
                data: CallSignal.callEndBusy,
                action: CallSignal.callEndBusy,
                isTyping: false,
                sender: myUuid,
                type: MessageType.Call,
                uuid: quickUuid(),
              }
              return ChatAction.publishMessage(
                endCallMessage,
                unifiedChat.channel
              )
            }
            if (isJoined) {
              return CallingAction.EMPTY()
            }
            const callingChannelParams = {
              myUuid,
              myId,
              caller: unifiedChat.last_message.sender_uuid,
              chatId: unifiedChat.channel,
              callingChannel:
                unifiedChat.type === "group"
                  ? unifiedChat.channel
                  : unifiedChat.last_message.content.split("#")[1],
              isGroup: unifiedChat.type === "group",
              displayText: "",
              unmuteAlert:
                unifiedChat.type === "group" &&
                myUuid !== unifiedChat.last_message.sender_uuid,
            }
            if (
              (!isCalling && unifiedChat.last_message.sender_uuid !== myUuid) ||
              (isCalling && unifiedChat.last_message.sender_uuid === myUuid)
            )
              return CallingAction.setCallingChannelAfterSignal(
                callingChannelParams
              )
          } else if (unifiedChat.last_message.action === CallSignal.muted) {
            const callSignalArray = unifiedChat.last_message.content.split(" ")
            const toBeMutedUuid = callSignalArray[callSignalArray.length - 1]
            if (toBeMutedUuid === myId.toString()) {
              if (!isAudioEnabled && !isVideoEnabled) {
                return CallingAction.EMPTY()
              }
              isAudioEnabled && toggleAudio(true)
              isVideoEnabled && toggleVideo(true)
              const actions =
                isAudioEnabled && isVideoEnabled
                  ? [
                      CallingAction.toggleAudioMode(),
                      CallingAction.toggleVideoMode(),
                    ]
                  : isAudioEnabled
                  ? CallingAction.toggleAudioMode()
                  : CallingAction.toggleVideoMode()
              return actions
            }
          } else if (
            unifiedChat.last_message.action === CallSignal.callEndBusy &&
            !isGroup &&
            chatId === unifiedChat.channel &&
            isCalling
          ) {
            return CallingAction.setDisplayText(
              `${unifiedChat.last_message.sender_username} is in another call`
            )
          } else if (
            unifiedChat.last_message.action === CallSignal.callEndDecline &&
            !isGroup &&
            chatId === unifiedChat.channel &&
            isJoined
          ) {
            return CallingAction.setDisplayText(
              `${unifiedChat.last_message.sender_username} declined the call`
            )
          } else if (
            leaveSignal &&
            ((unifiedChat.last_message.sender_uuid !== myUuid && isCalling) ||
              isJoined)
          ) {
            return CallingAction.setDisplayText(CallDisplayText.callEnded)
          } else if (
            unifiedChat.last_message.action === CallSignal.joined &&
            !isGroup &&
            unifiedChat.last_message.sender_uuid == myUuid &&
            isCalling &&
            !isJoined
          ) {
            return CallingAction.setDisplayText("")
          }
          return CallingAction.EMPTY()
        })
      return from(callingNotifications)
    })
  )

export const joinCallChannelEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(CallingActionType.SetCallingChannelAfterSignal),
    withLatestFrom(state$),
    map(([, state]) => {
      const myUuid = selectMyUuid(state)
      const myId = selectMyId(state)
      const caller = selectCallerUuid(state)
      const callingChannel = selectCallingChannel(state)
      const chatId = selectCallingChatId(state)
      const setRole = selectIsHost(state) ? 1 : 2
      const localAudioEnabled = selectAudioSetting(state).isAudioEnabled
      if (caller === myUuid) {
        joinCallChannel(callingChannel, myId, setRole, localAudioEnabled)
        return CallingAction.setJoinCall()
      }
      return CallingAction.EMPTY()
    })
  )

export const leaveCallForWarningsEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(CallingActionType.SetDisplayText),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter((action: any) => action.payload !== CallDisplayText.connecting),
    withLatestFrom(state$),
    delay(DELAY_END_CALL_TIME),
    map(() => CallingAction.leaveChannel())
  )

export const leaveCallEpic: Epic<AnyAction, AnyAction, State> = (
  action$,
  state$
) =>
  action$.pipe(
    ofType(CallingActionType.LeaveCallingChannel),
    withLatestFrom(state$),
    map(([, state]) => {
      const me = state.user
      const callingChannel = selectCallingChannel(state)
      const joinCall = selectJoinCall(state)
      if (!joinCall.isJoined) {
        return CallingAction.leaveChannelSuccessful()
      }
      callingChannel && leaveCallingChannel(callingChannel, me)
      return CallingAction.setCallingToDefault()
    })
  )

export const resetAndroidAudioDefaultPlaybackEpic: Epic<
  AnyAction,
  AnyAction,
  State
> = (action$) =>
  action$.pipe(
    ofType(
      CallingActionType.SetJoinCallSuccessful,
      CallingActionType.LeaveCallingChannelSuccessful
    ),
    delay(300),
    map((action) => {
      if (action.payload !== 0)
        Audio.setAudioModeAsync({
          playThroughEarpieceAndroid: false,
        })
      return CallingAction.EMPTY()
    })
  )

export const callingEpic = combineEpics(
  serveCallingNotificationsEpic,
  leaveCallForWarningsEpic,
  leaveCallEpic,
  joinCallChannelEpic,
  resetAndroidAudioDefaultPlaybackEpic
)
