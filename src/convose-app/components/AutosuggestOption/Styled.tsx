import { TouchableOpacity, View } from "react-native"
import styled from "styled-components"
import { FontAwesome } from "@expo/vector-icons"

import { CenteredText, Props } from "convose-styles"

export const StyledOptionView = styled(TouchableOpacity)`
  align-self: flex-end;
  flex-direction: row;
  justify-content: flex-start;
  min-height: 30px;
  padding: 5px 10px;
  width: 100%;
`
export const StyledOptionText = styled(CenteredText)`
  color: ${(props: Props) => props.theme.interests.autocompleteList.color};
  font-size: 14px;
  margin: 10px 0;
  font-family: Popins-light;
`
type ExistingIndicatorProps = Props & { removed: boolean }
export const StyledExistingIndicatorText = styled(StyledOptionText)`
  font-weight: 700;
  font-size: 11px;
  font-family: Popins-bold;
  color: ${(props: ExistingIndicatorProps) =>
    props.removed
      ? props.theme.interests.autocompleteList.removed
      : props.theme.interests.autocompleteList.added};
  margin: 0;
`
export const AddedMarkerWrapper = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -9px;
  left: 30px;
  padding: 0 2px;
  background: ${(props: Props) =>
    props.theme.interests.autocompleteList.background};
`
export const StyledFontAwesomeAddedMarker = styled(FontAwesome)`
  margin-right: 4;
  color: ${(props: ExistingIndicatorProps) =>
    props.removed
      ? props.theme.interests.autocompleteList.removed
      : props.theme.interests.autocompleteList.added};
`

export const InterestTextWrapper = styled(View)`
  max-width: 100%;
`
type InterestWrapperProps = Props & {
  hasAdded: boolean
  removed: boolean
}
export const InterestWrapper = styled(View)`
  flex-direction: row;
  justify-content: flex-start;
  border-width: 1px;
  width: 100%;
  border-radius: 11px;
  padding: 3px 10px;
  position: relative;
  border-color: ${(props: InterestWrapperProps) => {
    if (props.hasAdded) {
      return props.theme.interests.autocompleteList.added
    }
    if (props.removed) {
      return props.theme.interests.autocompleteList.removed
    }
    return "transparent"
  }};
`
