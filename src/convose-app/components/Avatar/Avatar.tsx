/* eslint-disable react-perf/jsx-no-new-object-as-prop */
import * as React from "react"

import { Avatar as UserAvatar } from "convose-lib/user"
import FastImage from "react-native-fast-image"
import { StyledAvatar, StyledImage } from "./Styled"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const defualtAvatarImage = require("../../../assets/Icons/avatar.png")

export type AvatarProps = {
  readonly height?: number
  readonly userAvatar?: UserAvatar
  readonly width?: number
}

export const Avatar: React.SFC<AvatarProps> = ({
  height = 60,
  width = 60,
  userAvatar,
}) => (
  <StyledAvatar height={height} width={width}>
    <StyledImage
      height={height}
      width={width}
      source={
        userAvatar && userAvatar.url
          ? { uri: userAvatar.url, priority: FastImage.priority.low }
          : defualtAvatarImage
      }
    />
  </StyledAvatar>
)
