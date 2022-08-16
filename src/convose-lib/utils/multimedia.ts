import { Audio } from "expo-av"
import * as FileSystem from "expo-file-system"
import * as ImagePicker from "expo-image-picker"
import { PhotoManipulator } from "react-native-photo-manipulator"
import { Alert, Platform } from "react-native"
import RNFS from "react-native-fs"
import * as MediaLibrary from "expo-media-library"

import {
  getCameraPermission,
  getRNAndroidCameraPermission,
  permissionNotAllowed,
} from "."
import { convoseAlertRef } from "../../convose-app/RootConvoseAlert"

// Constants:
export const RECORDING_OPTIONS_PRESET_HIGH_QUALITY: Audio.RecordingOptions = {
  android: {
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    bitRate: 128000,
    extension: ".m4a",
    numberOfChannels: 2,
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    sampleRate: 16000,
  },
  ios: {
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    bitRate: 128000,
    extension: ".m4a",
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
    numberOfChannels: 2,
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
    sampleRate: 44100,
  },
}
export const RECORDING_OPTIONS_PRESET_LOW_QUALITY: Audio.RecordingOptions = {
  android: {
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_AMR_WB,
    bitRate: 128000,
    extension: ".m4a",
    numberOfChannels: 2,
    outputFormat: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AMR_WB,
    sampleRate: 44100,
  },
  ios: {
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
    bitRate: 128000,
    extension: ".m4a",
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
    numberOfChannels: 2,
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
    sampleRate: 44100,
  },
}

// Functions:

export const takePicture = async (): Promise<string | void> => {
  const getPlatformCameraPermission =
    Platform.OS === "android"
      ? getRNAndroidCameraPermission
      : getCameraPermission
  const { status } = await getPlatformCameraPermission()

  if (status !== "granted") {
    permissionNotAllowed("CAMERA")
    return
  }

  try {
    const image = await ImagePicker.launchCameraAsync({
      base64: true,
    })

    if (image.cancelled) {
      return
    }

    const extension = getExtensionFromURL(image.uri)

    if (image.base64 && extension) {
      return `data:image/${extension};base64,${image.base64}`
    }
  } catch (error) {
    // console.log(error)
    convoseAlertRef?.show({
      ioniconName: "ios-warning",
      title: "Error",
      description:
        "Oops something went wrong while trying to take picture try again later",
    })
  }
}

export const chooseImage = async (): Promise<{
  data: string
  ratio: number
} | void> => {
  try {
    let base64
    let extension
    const image = await ImagePicker.launchImageLibraryAsync({
      base64: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    })

    if (image.cancelled) {
      return
    }
    extension = getExtensionFromURL(image.uri)
    const ratio = image.height / image.width || 1
    if (extension !== "gif") {
      const optimizedImage = await PhotoManipulator.optimize(image.uri, 40)
      extension = "jpeg"
      base64 = await RNFS.readFile(optimizedImage, "base64")
    } else {
      base64 = image.base64
    }
    if (base64) {
      return { data: `data:image/${extension};base64,${base64}`, ratio }
    }
  } catch (error) {
    convoseAlertRef?.show({
      ioniconName: "ios-warning",
      title: "Error",
      description: "Sorry about that, this type of image is not yet supported!",
    })
  }
}

export const setAudioMode = (): void => {
  Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    allowsRecordingIOS: false,
    interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
    shouldDuckAndroid: true,
    interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    playThroughEarpieceAndroid: false,
    staysActiveInBackground: true,
  })
    .then(() => {})
    .catch((err) => console.log("Error setting audio mode", err))
}

export const startRecordingAudio = async (): Promise<Audio.Recording | void> => {
  const { status } = await Audio.getPermissionsAsync()
  if (status === "granted") {
    const recording = new Audio.Recording()

    if (recording) {
      try {
        const { canRecord } = await recording.prepareToRecordAsync(
          RECORDING_OPTIONS_PRESET_LOW_QUALITY
        )
        if (canRecord) {
          const status = await recording.startAsync()
          return recording
        }
      } catch (error) {
        // console.log('START FAIL', error)
        convoseAlertRef?.show({
          ioniconName: "ios-warning",
          title: "Error",
          description:
            "Oops something went wrong while trying to record the audio try again later",
        })
      }
    }
  } else {
    permissionNotAllowed("MICROPHONE")
  }
}

export const stopRecordingAudio = async (
  recording: Audio.Recording
): Promise<string | void> => {
  if (recording) {
    try {
      const status = await recording.stopAndUnloadAsync()
      const uri = recording.getURI()

      if (uri) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: "base64",
        })
        const extension = getExtensionFromURL(uri)

        return `data:audio/${extension};base64,${base64}`
      }
    } catch (error) {
      // console.log('STOP FAIL', error)
    }
  }
}

export const getExtensionFromURL = (url: string) => {
  const splitURI = url.split(".")
  return splitURI[splitURI.length - 1]
}

export const millisToMinutesAndSeconds = (millis: number): string => {
  const minutes = Math.floor(millis / 60000)
  const seconds = ((millis % 60000) / 1000).toFixed(0)
  return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`
}

export const millisToMinutesAndSecondsToMillis = (
  millis: number
): Array<string> => {
  const minutes = Math.floor(millis / 60000).toFixed(0)
  const seconds = ((millis % 60000) / 1000).toFixed(0)
  const milliseconds = Math.floor((millis % 1000) / 10).toFixed(0)
  return [minutes, seconds, milliseconds]
}
function getUrlExtension(url: string): string {
  return url.split(/[#?]/)[0].split(".").pop().trim()
}

export const downloadFile = async (
  url: string,
  downloadProgressCallback?: (progress: number) => void
): Promise<string> => {
  const extension = getUrlExtension(url)
  const filename = new Date().getTime().toString()
  const callback = (downloadProgress: FileSystem.DownloadProgressData) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite
    if (downloadProgressCallback) {
      downloadProgressCallback(progress)
    }
  }
  const downloadResumable = FileSystem.createDownloadResumable(
    url,
    `${FileSystem.documentDirectory}${filename}.${extension}`,
    {},
    callback
  )
  try {
    const result = await downloadResumable.downloadAsync()
    if (result) {
      return result.uri
    }
    return ""
  } catch (e) {
    return ""
  }
}
export const saveMediaToLibrary = (localUri: string): Promise<void> => {
  return MediaLibrary.saveToLibraryAsync(localUri)
}
