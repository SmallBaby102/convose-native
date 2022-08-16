/* eslint-disable no-nested-ternary */
import { TouchableOpacity } from "react-native"
import styled from "styled-components"

import { CenteredText, color, font, Props } from "convose-styles"
import { ButtonType } from "./PrimaryButton"

type ButtonProps = Props & { padding: number }
export const NormalButton = (props: ButtonProps): string => `
    background: ${props.color ? props.color : props.theme.mainBlue}
    min-width: 150px
    padding: ${props.padding + 2}px;
`

export const OutlineButton = (props: Props): string => `
    background: transparent
    min-width: 150px
    borderWidth: 2
    borderColor: ${props.color ? props.color : props.theme.mainBlue}
`

export const TextButton = (props: Props): string => `
    background: transparent
    padding: 0
`

const applyTypeStyle = (props: Props & { type: ButtonType } & ButtonProps) => {
  switch (props.type) {
    case ButtonType.normal:
      return NormalButton(props)
    case ButtonType.outline:
      return OutlineButton(props)
    case ButtonType.text:
      return TextButton(props)
    default:
      return NormalButton(props)
  }
}

export const ButtonArea = styled(TouchableOpacity)`
  border-radius: 50px;
  text-align: center;
  justify-content: center;
  padding: ${(props: ButtonProps) => props.padding}px;
  ${(props: Props) => props.height && `height: ${props.height};`};
  ${applyTypeStyle};
`

export const Label = styled(CenteredText)`
  font-family: ${(props: { fontFamily: string }) =>
    props.fontFamily ? props.fontFamily : font.bold};
  font-size: ${(props: Props) => (props.fontSize ? props.fontSize : 18)};
  text-align: center;
  color: ${(props: { isTextMainBlue: boolean } & Props) =>
    props.isTextMainBlue
      ? props.theme.mainBlue
      : props.color
      ? props.color
      : color.white};
`
