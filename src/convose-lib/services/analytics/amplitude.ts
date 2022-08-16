import * as Amplitude from "expo-analytics-amplitude"

const API_KEY = "2b904919b614206288119f30055e52aa"

export const logEvent = (eventName: string): void => {
  Amplitude.logEventAsync(eventName)
}

export const initializeAmplitude = (): void => {
  Amplitude.initializeAsync(API_KEY).then(() => {
    logEvent("openApp")
  })
}
