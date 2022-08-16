import { Platform } from "react-native"
import { color } from "./colors"

type ShadowStyles = {
  readonly borderBottom?: boolean
  readonly borderLeft?: boolean
  readonly borderRadius?: number
  readonly borderRight?: boolean
  readonly borderTop?: boolean
  readonly borderTopLeftRadius?: number
  readonly borderTopRightRadius?: number
  readonly borderWidth?: number
  readonly elevation?: number
  readonly opacity?: number
  readonly radius?: number
  readonly shadowColor?: string
  readonly borderColor?: string
}

const iosShadows = {
  shadowOffset: {
    height: 0,
    width: 0,
  },
  shadowOpacity: 0.3,
  shadowRadius: 4.65,
}

const iosSoft = {
  shadowColor: color.black,
  shadowOffset: {
    height: 0,
    width: 0,
  },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,
}

const iosHard = {
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 7,
  },
  shadowOpacity: 0.43,
  shadowRadius: 9.51,
}

export const defaultShadows =
  Platform.OS === "ios" ? iosShadows : { elevation: 8 }
export const softShadows = Platform.OS === "ios" ? iosSoft : { elevation: 3 }
export const hardShadow = Platform.OS === "ios" ? iosHard : { elevation: 15 }


export const shadowStyles = ({
  borderBottom = true,
  borderLeft = true,
  borderRadius = 8,
  borderRight = true,
  borderTop = true,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderWidth = 1,
  elevation = 24,
  opacity = 0.2,
  radius = 3,
  shadowColor = color.gray,
  borderColor = color.black,
}: ShadowStyles) => ({
  borderBottomWidth: borderBottom ? borderWidth : 0,
  borderColor: borderColor,
  borderLeftWidth: borderLeft ? borderWidth : 0,
  borderRadius,
  borderRightWidth: borderRight ? borderWidth : 0,
  borderTopLeftRadius: borderTopLeftRadius ? borderTopLeftRadius : borderRadius,
  borderTopRightRadius: borderTopRightRadius
    ? borderTopRightRadius
    : borderRadius,
  borderTopWidth: borderTop ? borderWidth : 0,
  elevation,
  shadowColor,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: opacity,
  shadowRadius: radius,
})
