import { isTablet } from "convose-lib/utils"
/* eslint-disable import/no-extraneous-dependencies */
import { Dimensions } from "react-native"
import _default from "expo-constants"

export const { width } = Dimensions.get("window")
export const { height } = Dimensions.get("window")

export const PROFILE_WIDTH = isTablet() ? 400 : width * 0.9
export const DEFAULT_INTEREST_SIZE = 10
export const MY_INTEREST_SIZE = 8
export const chatHeight = 220
export const appHeaderHeight = 80
export const chatInputBarHeight = 56
export const interestsBarHeight = 60
export const navbarBottomInset = 25
export const roundedBorders = 30
export const { statusBarHeight } = _default
export const ongoingCallHeight = 30
export const AVATAR_SIZE = 60
export const AVATAR_SIZE_SML = 30
