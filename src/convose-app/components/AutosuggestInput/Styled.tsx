import { TextInput, TouchableOpacity, View } from "react-native"
import styled from "styled-components"

import { CenteredText, color, Props } from "convose-styles"

const borderRadius = 40

export const AutosuggestWrapper = styled(TouchableOpacity)`
  flex: 1;
  border-radius: ${borderRadius};
  overflow: hidden;
  background: ${(props: Props & { text: { length: number } }) =>
    props.text.length
      ? color.blue
      : props.theme.interests.input.wrapperBackground};
  height: 50px;
`

export const StyledAutosuggestInput = styled(TextInput)`
  height: 100%;
  width: 100%;
  padding: 5px 20px;
  color: transparent;
  include-font-padding: false;
  text-align-vertical: center;
`

export const Label = styled(CenteredText)`
  font-family: Popins-light;
  font-size: 18px;
  color: ${color.white};
`

export const LabelWrapper = styled(View)`
  color: ${color.white};
  text-align: center;
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  border-radius: ${borderRadius};
`

// old
export const StyledTextInput = styled(TextInput)`
  border-radius: ${borderRadius};
  color: ${(props: Props) => props.theme.interests.input.buttonBackground};
  padding: 5px 20px;
  flex: 1;
  font-size: 18px;
  include-font-padding: false;
  text-align-vertical: center;
`
