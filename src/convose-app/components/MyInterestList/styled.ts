import { Image, View } from "react-native"
import styled from "styled-components"

import { CenteredText, color, Props } from "convose-styles"
import { SearchInterests } from "../../components/SearchInterests"

const CONTAINER_PADDING = "15px"

export const InterestsWrapper = styled(View)`
  background: ${(props: Props) => props.theme.main.background};
  flex-direction: column;
  padding-horizontal: ${CONTAINER_PADDING};
`

export const InterestsLabel = styled(CenteredText)`
  font-family: Popins-light;
  font-size: 15px;
  color: ${(props: Props) => props.theme.main.text};
  margin-bottom: 10px;
`

export const InterestsList = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-self: flex-start;
`

// NO INTEREST VIEW
export const NoInterestsView = styled(View)`
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  align-self: center;
`

export const NoInterestsImage = styled(Image)`
  width: 236.91px;
  height: 259px;
  align-self: center;
  resize-mode: contain;
`

export const NoInterestText = styled(CenteredText)`
  font-family: Popins;
  font-size: 12px;
  align-self: center;
  letter-spacing: 0.43px;
  text-align: center;
  color: ${color.myInterests.gray};
  margin: 0 30px;
  margin-top: 5px;
`

// ADD INTEREST BUTTON
export const AddInterestButton = styled(SearchInterests)`
  margin: 6px;
  margin-top: ${(props: { length: boolean }) =>
    props.length ? "6px" : "20px"};
  align-self: center;
`

export const ButtonLabel = styled(CenteredText)`
  font-family: Popins-light;
  font-size: 16px;
  text-align: center;
  color: ${color.white};
`
export const NoInterestsImageContainer = styled(View)`
  width: 100%;
  justify-content: space-around;
  align-items: center;
  margin-top: 20px;
  padding: 0 30px;
  flex-direction: row;
`
type IconContainerProps = Props & { stepUp: boolean }
export const IconContainer = styled(View)`
  ${(props: IconContainerProps) => props.stepUp && `margin-bottom: 50px;`}
`
export const InterestContainer = styled(NoInterestsView)`
  width: 100%;
`
