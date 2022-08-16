import { TextInput, View, Platform } from "react-native"
import styled from "styled-components"

import { font, Props } from "convose-styles"
import { SvgButton } from "../../IconButton"

const isAndroid = Platform.OS === "android"

export const InputWrapper = styled(View)`
  border-radius: 30;
  background-color: ${(props: Props) => props.theme.textInput.background};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  padding: 5px 15px;
`

export const StyledInput = styled(TextInput)`
  /* height: ${isAndroid ? 34 : 34}px; */
  height: 34px;
  font-family: ${font.bold};
  font-size: 28px;
  padding: 0;
  margin: 0;
  margin-left: -3.5px;
  margin-top: ${isAndroid ? 1.7 : 1}px;
  margin-bottom: ${isAndroid ? 0.1 : 0}px;
  ${isAndroid && "line-height: 32px;"}
  align-self: center;
  color: ${(props: Props) =>
    props.color ? props.color : props.theme.mainBlue};
  text-align: left;
  include-font-padding: false;
  text-align-vertical: center;
  min-width: 120px;
`

export const EditButton = styled(SvgButton)`
  margin-left: 5px;
`
export const BoxSize = styled(View)`
  position: absolute;
  width: 12px;
  height: 12px;
  background-color: red;
`
export const BoxSizeTop = styled(BoxSize)`
  top: 0;
  left: 15px;
`
export const BoxSizeBottom = styled(BoxSize)`
  bottom: 0;
  left: 15px;
`
