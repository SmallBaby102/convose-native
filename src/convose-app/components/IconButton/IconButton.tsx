/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import { Ionicons } from "@expo/vector-icons"
import React, { useContext } from "react"
import { StyleProp, ViewStyle } from "react-native"

import { DEFAULT_HIT_SLOP } from "convose-lib/utils"
import { ThemeContext } from "styled-components"
import { StyledButton } from "./Styled"

type PropsType = {
  readonly onPress?: () => void
  readonly size: number
  readonly style?: StyleProp<ViewStyle>
}
type SvgButtonProps = PropsType & {
  readonly iconComponent: JSX.Element
}
type IconButtonProps = PropsType & {
  readonly name: string
  readonly iconColor: string
}

export const SvgButton: React.SFC<SvgButtonProps> = ({
  iconComponent,
  onPress,
  ...otherProps
}) => {
  const theme: any = useContext(ThemeContext)
  return (
    <StyledButton
      onPress={onPress}
      disabled={!onPress}
      hitSlop={DEFAULT_HIT_SLOP}
      {...otherProps}
      underlayColor={theme.ButtonOnPress}
    >
      {iconComponent}
    </StyledButton>
  )
}
export const IconButton: React.SFC<IconButtonProps> = ({
  name,
  onPress,
  size,
  iconColor,
  ...otherProps
}) => {
  const theme: any = useContext(ThemeContext)
  return (
    <StyledButton
      onPress={onPress}
      disabled={!onPress}
      hitSlop={DEFAULT_HIT_SLOP}
      {...otherProps}
      size={size}
      underlayColor={theme.ButtonOnPress}
    >
      <Ionicons name={name} size={size} color={iconColor} />
    </StyledButton>
  )
}
