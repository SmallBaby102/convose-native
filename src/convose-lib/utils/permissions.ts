// eslint-disable-next-line import/no-extraneous-dependencies
import { PermissionsAndroid, Platform, Linking } from "react-native"
// eslint-disable-next-line import/no-extraneous-dependencies
import { Audio } from "expo-av"
// eslint-disable-next-line import/no-extraneous-dependencies
import * as ImagePicker from "expo-image-picker"
// eslint-disable-next-line import/no-extraneous-dependencies
import * as MediaLibrary from "expo-media-library"
import { convoseAlertRef } from "../../convose-app/RootConvoseAlert"

export const getCameraPermission = async () =>
  ImagePicker.requestCameraPermissionsAsync()
export const getAudioRecordingPermission = async () =>
  Audio.requestPermissionsAsync()
export const getCameraRollPermission = async (): Promise<MediaLibrary.PermissionResponse> =>
  MediaLibrary.requestPermissionsAsync()
export const canAccessMediaLibrary = async (): Promise<MediaLibrary.PermissionResponse> =>
  MediaLibrary.getPermissionsAsync(true)
export const getRNAndroidCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA
    )
    return { status: granted }
  } catch (arr) {
    console.warn(arr)
    return { status: "not granted" }
  }
}

export const getRNAndroidAudioPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
    )
    return { status: granted }
  } catch (arr) {
    console.warn(arr)
    return { status: "not granted" }
  }
}

export const permissionNotAllowedDefaultTitle = "Permission is not allowed"
export const permissionNotAllowedDefaultDescription = (
  permissionName: string
): string => `Sorry, we need ${permissionName} permissions to make this work!`
// handlePermissionNotAllowed
export const permissionNotAllowed = (
  permissionName: string,
  title = permissionNotAllowedDefaultTitle
): void => {
  convoseAlertRef?.show({
    ioniconName: "ios-warning",
    title,
    description: permissionNotAllowedDefaultDescription(permissionName),
  })
}

export const asyncAlert = async (
  title: string,
  message: string,
  firstBtnLabel: string,
  secondBtnLabel: string
): Promise<string> =>
  new Promise((resolve, reject) => {
    convoseAlertRef?.show({
      ioniconName: "ios-warning",
      title,
      description: message,
      buttons: [
        {
          title: firstBtnLabel,
          onPress: () => {
            resolve("YES")
          },
        },
        {
          title: secondBtnLabel,
          onPress: () => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject("NO")
          },
        },
      ],
    })
  })

export const getAudioPermission = async (): Promise<string> => {
  const audioPermissionFunction =
    Platform.OS === "android"
      ? getRNAndroidAudioPermission
      : getAudioRecordingPermission
  const { status } = await audioPermissionFunction()
  if (status !== "granted") {
    permissionNotAllowed("MICROPHONE")
  }
  return status
}

export const getVideoPermission = async (): Promise<string> => {
  const videoPermissionFunction =
    Platform.OS === "android"
      ? getRNAndroidCameraPermission
      : getCameraPermission
  const { status } = await videoPermissionFunction()
  if (status !== "granted") {
    permissionNotAllowed("CAMERA")
  }
  return status
}

export const handleOpenSettings = (): void => {
  if (Platform.OS === "ios") {
    Linking.openURL("app-settings:")
  } else {
    Linking.openSettings()
  }
}
