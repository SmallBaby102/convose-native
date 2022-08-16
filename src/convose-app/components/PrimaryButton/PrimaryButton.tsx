/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { TouchableOpacityProps } from "react-native"

import { ButtonArea, Label } from "./styled"

export enum ButtonType {
  normal = "normal",
  outline = "outline",
  text = "text",
}

type PrimaryButtonProps = TouchableOpacityProps & {
  readonly label: string
  readonly color?: string
  readonly textColor?: string
  readonly isTextMainBlue?: boolean
  readonly onPress: () => void
  readonly type?: string
  readonly children?: any
  readonly fontFamily?: string
  readonly fontSize?: number
  readonly padding?: number
}

export const PrimaryButton: React.SFC<PrimaryButtonProps> = ({
  label,
  color,
  onPress,
  textColor,
  isTextMainBlue,
  fontFamily,
  fontSize,
  type,
  children,
  padding,
  ...otherProps
}) => (
  <ButtonArea
    onPress={onPress}
    color={color}
    padding={padding || 15}
    {...otherProps}
    type={type || ButtonType.normal}
  >
    {children || (
      <Label
        color={textColor}
        isTextMainBlue={isTextMainBlue}
        fontFamily={fontFamily}
        fontSize={fontSize}
      >
        {label}
      </Label>
    )}
  </ButtonArea>
)
