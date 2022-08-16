/* eslint-disable import/no-extraneous-dependencies, no-console */

import Constants from "expo-constants"
import * as Notifications from "expo-notifications"
import { Platform } from "react-native"
import { quickUuid } from "convose-lib/utils"

const experienceId = !Constants.manifest
  ? "@murrelsamexpo/convoseapp"
  : undefined

export type ExpoPushToken = string | null

const getPermissionAsync = async (): Promise<string> => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  return finalStatus
}

export const registerForPushNotificationsAsync = async (): Promise<ExpoPushToken> => {
  try {
    await getPermissionAsync()

    const token: string = (
      await Notifications.getExpoPushTokenAsync({
        experienceId,
        deviceId: quickUuid(),
      })
    ).data

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      })
    }

    return token
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error)
    return error
  }
}
