/* eslint-disable react-perf/jsx-no-new-object-as-prop */
import { interestsBarHeight } from "convose-styles"
import * as React from "react"
import { Animated, View } from "react-native"
import { StyledBadge, StyledBadgeWrapper } from "./Styled"

type IconBadgeProps = {
  readonly fontSize?: number
  readonly height?: number
  readonly inboxIndicator?: boolean
  readonly text?: string
  readonly width?: number
  readonly opacity?: Animated.AnimatedInterpolation
}

export const IconBadge: React.SFC<IconBadgeProps> = ({
  children,
  fontSize = 9,
  height = 15,
  inboxIndicator = true,
  text = "",
  width = 15,
}) => (
  <View>
    {children}
    <StyledBadgeWrapper
      style={{ borderRadius: height / 2, height, width }}
      inboxIndicator={inboxIndicator}
    >
      <StyledBadge style={{ fontSize }}>{text}</StyledBadge>
    </StyledBadgeWrapper>
  </View>
)

export const IconBadgeTriangle: React.SFC<IconBadgeProps> = ({
  height = 15,
  width = 15,
  opacity = 0,
}) => (
  <Animated.View
    style={{
      height,
      width,
      position: "absolute",
      bottom: interestsBarHeight - 15,
      left: "9.5%",
      borderRadius: 0,
      borderStyle: "solid",
      borderTopWidth: 10,
      borderLeftWidth: 10,
      borderRightWidth: 10,
      borderBottomWidth: 0,
      borderTopColor: "rgba(61, 61, 61, 1)",
      borderLeftColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: "transparent",
      backgroundColor: "transparent",
      zIndex: 130,
      elevation: 0,
      opacity,
    }}
  />
)
