/* eslint-disable react/jsx-props-no-spreading */
import React, { FunctionComponent } from "react"
import { Entypo } from "@expo/vector-icons"
import { TouchableOpacityProps } from "react-native"
import { NavigationInjectedProps } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { State } from "convose-lib/store"

import { InterestsAction } from "convose-lib/interests"
import { Routes } from "convose-lib/router"
import { DEFAULT_HIT_SLOP } from "convose-lib/utils"
import { color } from "convose-styles"
import { OnboardingAction, selectAddInterestExplainer } from "convose-lib"
import { ButtonWrapper, Label } from "./Styled"
import * as RootNavigation from "../../RootNavigation"

type DispatchToProps = {
  readonly searchInterests: (text: string) => void
  readonly hideAddInterestExplainer: () => void
}
type ComponentProps = {
  readonly showingAddInterestExplainer: boolean
}
type SearchInterestsProps = TouchableOpacityProps &
  DispatchToProps &
  NavigationInjectedProps &
  ComponentProps

export const SearchInterestsComponent: FunctionComponent<SearchInterestsProps> = ({
  searchInterests,
  hideAddInterestExplainer,
  showingAddInterestExplainer,
  ...touchableOpacityProps
}) => {
  const openInterestsList = () => {
    if (showingAddInterestExplainer) {
      hideAddInterestExplainer()
    }
    searchInterests("")
    RootNavigation.navigate(Routes.Interests, {})
  }

  return (
    <ButtonWrapper
      onPress={openInterestsList}
      hitSlop={DEFAULT_HIT_SLOP}
      {...touchableOpacityProps}
    >
      <Entypo name="plus" size={22} color={color.white} />
      <Label>Interests</Label>
    </ButtonWrapper>
  )
}
const mapStateToProps = (state: State) => ({
  showingAddInterestExplainer: selectAddInterestExplainer(state),
})
const mapDispatchToProps = (dispatch: Dispatch): DispatchToProps => ({
  searchInterests: (text: string) => {
    dispatch(InterestsAction.searchInterests(text))
  },
  hideAddInterestExplainer: () =>
    dispatch(OnboardingAction.hideAddInterestExplainer()),
})

export const SearchInterests = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchInterestsComponent)
