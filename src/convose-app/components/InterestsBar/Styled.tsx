import { TouchableOpacity, View, Text } from "react-native"
import styled from "styled-components"

import { interestsBarHeight, Props } from "convose-styles"

type InsetProps = {
  insetBottom: number
}
export const StyledInterestsBarView = styled(View)`
  background: ${(props: Props) =>
    props.theme.interests.inputAndCurrentInterests.background};
  width: 100%;
  /* padding: 10px 15px; */
  z-index: 102;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  overflow: hidden;
  padding-bottom: ${(props: InsetProps) => props.insetBottom}px;
`
type BarViewProps = Props & { renderNewInterest: boolean }
export const InterestBarContainer = styled(View)`
  background: ${(props: BarViewProps) =>
    props.renderNewInterest
      ? props.theme.interests.autocompleteList.newInterestBackground
      : "transparent"};
  flex-direction: column;
  width: 100%;
  padding-bottom: 10px;
  padding-top: 10px;
`
export const InterestBarActionsContainer = styled(View)`
  align-content: center;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  padding-left: 15px;
  padding-right: 15px;
  /* height: ${interestsBarHeight}px; */
`
export const CurrentInterestsWrapper = styled(View)`
  width: 100%;
  min-height: 0;
  margin-bottom: 5;
  padding-left: 12px;
`
export const DoneButton = styled(TouchableOpacity)`
  height: 50px;
  width: 50px;
  align-items: center;
  justify-content: center;
  margin-left: 35;
  margin-right: 20;
`
export const DoneButtonTitle = styled(Text)`
  font-family: Popins-bold;
  font-weight: 600;
  color: ${(props: Props) => props.theme.mainBlue};
  font-size: 16px;
  align-self: center;
  include-font-padding: false;
  text-align-vertical: center;
`
