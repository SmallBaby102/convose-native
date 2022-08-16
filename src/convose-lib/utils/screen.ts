//import DeviceInfo from "react-native-device-info"
import { Dimensions, PixelRatio, Platform, PlatformIOSStatic } from 'react-native'

const isIPad = Platform.OS === 'ios' && (Platform as PlatformIOSStatic).isPad

const isAndroidTablet = (): boolean => {
  const windowSize = Dimensions.get('window')
  const windowWidth = windowSize.width

  const adjustedWidth = windowWidth * PixelRatio.get()

  return PixelRatio.get() <= 2 && (adjustedWidth > 768)
    || PixelRatio.get() > 2 && (adjustedWidth > 1440)
}

export const isTablet = (): boolean => isIPad || (Platform.OS !== 'ios' && isAndroidTablet())

//To be done: current ios version 2.4.8, android version 23 has "react-native-device-info" library, but versions before current version using new library (isTablet) will cause crash, so in the future when most users upgrade to newer versions, we can change isTablet by using this package

//To be done: modify header height (with status bar) for different devices (with notch)
// export const hasNotch = (): boolean => DeviceInfo.hasNotch()
