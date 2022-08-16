import { View, StyleSheet, Text } from "react-native"
import styled from "styled-components"

import { color, interestsBarHeight, Props } from "convose-styles"
import { Ionicons } from "@expo/vector-icons"
import { SearchInterests } from "../SearchInterests"
import { SvgButton } from "../IconButton/IconButton"

const navbarHeight = interestsBarHeight

type NavbarViewProps = {
  bottomInset?: number
}
function calculateHeight(props: NavbarViewProps) {
  const addHeight = props.bottomInset || 0
  return navbarHeight + addHeight + 30
}
function calculatePadding(props: NavbarViewProps) {
  return props.bottomInset || 0
}
export const NavbarView = styled(View)`
  background: rgba(0, 0, 0, 0);
  position: absolute;
  bottom: 0;
  width: 100%;
  height: ${calculateHeight};
  padding-horizontal: 15;
  justify-content: space-around;
  align-items: flex-end;
  flex-direction: row;
  elevation: 4;
  padding-bottom: ${calculatePadding};
`

export const SearchInterestsButton = styled(SearchInterests)`
  transform: translateY(-30px);
  elevation: 5;
  /* margin-bottom: ${calculatePadding}; */
`
export const NavActionTitle = styled(Text)`
  color: ${(props: Props) => props.theme.mainBlue};
  font-family: Popins-light;
  font-size: 12;
`
export const NavActionContainer = styled(View)`
  align-items: center;
`
export const Styles = StyleSheet.create({
  searchInterestShadow: {
    shadowOffset: { width: 0, height: 4 },
    shadowColor: color.black,
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
})

export const WhiteBackgroundBar = styled(View)`
  position: absolute;
  width: 100%;
  height: ${(props: NavbarViewProps) => calculateHeight(props) - 30}px;
  background-color: ${(props: Props) => props.theme.statusBar};
  bottom: 0;
  z-index: 0;
`

export const ProfileSvg = styled(SvgButton)`
  bottom: 15px;
`

export const ExplainerIcon = styled(Ionicons)`
  color: ${(props: Props) => props.theme.explainerText};
`
export const ExplainerIconsWrapper = styled(View)`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  margin-top: -10px;
  margin-bottom: -15px;
  padding-horizontal: 10px;
`
export const ExplainerIconContainer = styled(View)``
export const ExplainerIconsInsideWrapper = styled(View)`
  flex-direction: column;
  justify-content: space-around;
`
// export const ExplainerBox = styled(View)`
//   background-color: ${(props: Props) => props.theme.mainBlue};
//   border-radius: 13px;
//   padding: 28px;
//   margin-bottom: 30px;
// `
// export const ExplainerText = styled(Text)`
//   font-size: 28px;
//   font-family: Popins-bold;
//   color: ${(props: Props) => props.theme.explainerText};
//   text-align: center;
// `
// export const ExplainerTextWrapper = styled(View)`
//   margin-bottom: 35px;
// `
// export const ExplainerButton = styled(TouchableOpacity)`
//   background-color: ${(props: Props) => props.theme.explainerText};
//   height: 60px;
//   border-radius: 40px;
//   justify-content: center;
//   margin-bottom: 20px;
//   margin-left: 10px;
//   margin-right: 10px;
// `
// export const ExplainerButtonLabel = styled(ExplainerText)`
//   color: ${(props: Props) => props.theme.mainBlue};
// `
// export const ExplainerArrow = styled(View)`
//   width: 0;
//   height: 0;
//   background-color: transparent;
//   border-style: solid;
//   border-top-width: 50;
//   border-right-width: 50;
//   border-bottom-width: 0;
//   border-left-width: 50;
//   border-top-color: ${(props: Props) => props.theme.mainBlue};
//   border-right-color: transparent;
//   border-bottom-color: transparent;
//   border-left-color: transparent;
//   background-color: transparent;
//   position: absolute;
//   bottom: -30px;
//   align-self: center;
//   z-index: 15;
// `
// export const ExplainerWrapper = styled(View)`
//   position: absolute;
//   width: 100%;
//   bottom: ${navbarHeight + 5};
//   padding-left: 10%;
//   padding-right: 10%;
//   left: 0;
//   right: 0;
//   top: 0;
//   justify-content: flex-end;
//   align-items: center;
//   z-index: 5;
// `
