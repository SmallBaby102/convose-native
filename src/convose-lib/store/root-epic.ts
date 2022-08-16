import { AnyAction } from "redux"
import { combineEpics, createEpicMiddleware } from "redux-observable"
import { State } from "./state"

import { appEpic } from "../app"
import { chatEpic } from "../chat"
import { interestsEpic } from "../interests"
import { toastEpic } from "../toast"
import { userEpic } from "../user"
import { usersListEpic } from "../users-list"
import { callingEpic } from "../calling"
import { authEpic } from "../auth"

export const rootEpic = combineEpics(
  authEpic,
  appEpic,
  chatEpic,
  interestsEpic,
  toastEpic,
  userEpic,
  callingEpic,
  usersListEpic
)
export const epicMiddleware = createEpicMiddleware<
  AnyAction,
  AnyAction,
  State
>()
