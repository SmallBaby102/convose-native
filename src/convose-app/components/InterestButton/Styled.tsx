import { MaterialIcons } from "@expo/vector-icons"
import { TouchableOpacity } from "react-native"
import styled from "styled-components"

import { InterestLocation } from "convose-lib/interests"
import { CenteredText, color, Props } from "convose-styles"
import { MaterialIndicator } from "react-native-indicators"

export type ButtonWrapperProps = {
  readonly location?: InterestLocation
}

export const DEFAULT_INTEREST_SIZE = 10

// INTEREST BUTTON
type ButtonWrapperViewProps = Props & {
  disabled: boolean
  addBorder: boolean
  transparentBackground: boolean
}
export const ButtonWrapperView = styled(TouchableOpacity)`
  align-self: flex-start;
  align-items: center;
  background: ${(props: ButtonWrapperViewProps) => {
    if (props.color) {
      return props.color
    }
    if (props.disabled) {
      return props.theme.interests.button.disabledBackground
    }
    if (props.transparentBackground) {
      return "transparent"
    }
    return props.theme.interests.button.background
  }};
  border-radius: 50;
  flex-direction: row;
  justify-content: space-around;
  margin: 5px;
  max-width: 95%;
  padding: ${(props: Props) =>
    props.size ? props.size / 2 : DEFAULT_INTEREST_SIZE / 2}px;
  ${(props: ButtonWrapperViewProps) =>
    props.addBorder &&
    `border-width: 1px;
  border-color: ${props.theme.mainBlue};`}
`
type LabelProps = Props & {
  location: InterestLocation
  hasDelete: boolean
  hasRating: boolean
}
// export const Label = styled.Text`
export const Label = styled(CenteredText)`
  color: ${(props: LabelProps) =>
    props.location === InterestLocation.MyInterests
      ? props.theme.interests.button.text
      : props.theme.main.text};
  flex: 0 1 auto;
  font-size: ${(props: ButtonWrapperProps) =>
    props.location === InterestLocation.MyInterests ? "16px" : "12px"};
  text-shadow: none;
  font-family: ${(props: ButtonWrapperProps) =>
    props.location === InterestLocation.CallingScreen
      ? "Popins"
      : "Popins-light"};
  ${(props: LabelProps) => {
    if (!props.hasRating) {
      return ``
    }
    if (props.location === InterestLocation.MyInterests) {
      return `margin-top: -5.3px`
    }
    return `margin-top: -4px`
  }};
`

// POPUP BUTTON
export const PopupButtonWrapper = styled(ButtonWrapperView)`
  background: ${color.white};
  height: 37px;
  margin-top: 13px;
  margin-left: 13px;
  flex-direction: row;
  width: 97px;
  padding: 0px;
  padding-right: 0px;
  z-index: 125;
`
export const PopupButton = styled(Label)`
  color: ${(props: Props) => props.theme.mainBlue};
  text-align: center;
  flex: 1;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 4px;
  padding-left: 4px;
`

// ICONS
export const StyledIcon = styled(MaterialIcons)`
  color: ${color.lightRed};
`

export const IconButton = styled(TouchableOpacity)`
  margin-right: ${(props: Props) =>
    (props.size ? props.size : DEFAULT_INTEREST_SIZE) / 2}px;
  /* margin-left: ${(props: Props) =>
    props.size ? props.size : DEFAULT_INTEREST_SIZE}px; */
  align-self: center;
  justify-content: center;
  align-items: center;
`
export const WheelIconButton = styled(IconButton)`
  margin: 0;
`
export const LoadingSpinner = styled(MaterialIndicator)`
  margin: 0 13px 0 13px;
  flex: none;
`
export const IconButtonOnPopup = styled(TouchableOpacity)`
  margin-left: 10px;
  padding: -5px;
  margin-right: -5px;
`

export const LevelRatingContainer = styled.View`
  flex-direction: row;
  margin-top: 2px;
  margin-left: 1.2px;
`
export const LevelRating = styled.View`
  width: ${(props: LabelProps) =>
    props.location === InterestLocation.MyInterests ? 8 : 6}px;
  height: ${(props: LabelProps) =>
    props.location === InterestLocation.MyInterests ? 8 : 6}px;
  background-color: ${(props: LabelProps) =>
    props.location === InterestLocation.MyInterests
      ? props.theme.interests.button.text
      : props.theme.main.text};
  border-radius: 10px;
  margin-right: 2px;
`
export const LabelLevelContainer = styled.View`
  height: ${(props: LabelProps) =>
    props.location === InterestLocation.MyInterests ? 35 : 27}px;
  justify-content: center;
  margin: 0
    ${(props: Props) => (props.size ? props.size : DEFAULT_INTEREST_SIZE)}px;
  padding-left: ${(props: LabelProps) =>
    props.location === InterestLocation.MyInterests ? 3 : 0}px;
`
export const DeleteButtonContainer = styled.View`
  padding-right: 4px;
  padding-left: 1.4px;
`
