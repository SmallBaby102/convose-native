/* eslint-disable import/no-extraneous-dependencies */
import { combineReducers } from "redux"
import { persistReducer } from "redux-persist"
import AsyncStorage from "@react-native-async-storage/async-storage"
import immutableTransform from "redux-persist-transform-immutable"
import { appReducer } from "../app"
import { authReducer } from "../auth"
import { chatReducer } from "../chat"
import { interestsReducer } from "../interests"
import { onboardingReducer } from "../onboarding"
import { State } from "../store"
import { toastReducer } from "../toast"
import { userReducer } from "../user"
import { usersListReducer } from "../users-list"
import { callingReducer } from "../calling"

const appPersistConfig = {
  key: "app",
  storage: AsyncStorage,
  whitelist: ["setting"],
}

const chatPersistConfig = {
  transforms: [immutableTransform()],
  key: "chat",
  storage: AsyncStorage,
  whitelist: ["channels", "channelPendingMessages"],
}

const onboardingPersistConfig = {
  key: "onboarding",
  storage: AsyncStorage,
  whitelist: ["startOnboarding"],
}

const usersListPersistConfig = {
  key: "usersList",
  storage: AsyncStorage,
  whitelist: ["partners"],
}

const userPersistConfig = {
  key: "user",
  storage: AsyncStorage,
}

export const rootReducer = combineReducers<State>({
  app: persistReducer(appPersistConfig, appReducer),
  auth: authReducer,
  chat: persistReducer(chatPersistConfig, chatReducer),
  interests: interestsReducer,
  onboarding: persistReducer(onboardingPersistConfig, onboardingReducer),
  toast: toastReducer,
  user: persistReducer(userPersistConfig, userReducer),
  usersList: persistReducer(usersListPersistConfig, usersListReducer),
  calling: callingReducer,
})
