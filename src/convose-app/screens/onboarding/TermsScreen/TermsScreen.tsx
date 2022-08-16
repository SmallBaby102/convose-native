/* eslint-disable import/no-extraneous-dependencies */

import React from "react"
import { NavigationInjectedProps } from "react-navigation"

import { Routes } from "convose-lib/router"
import { TermsPopup } from "../../../components"
import { TermsScreenWrapper, TermsWrapper } from "./Styled"

export const TermsScreen: React.FunctionComponent<NavigationInjectedProps> = ({
  navigation,
}) => {
  const navigateToAddInterests = () => {
    navigation.navigate(Routes.OnboardingInterest)
  }

  const navigateToTermsContent = () => {
    navigation.navigate(Routes.OnboardingTermsContent)
  }

  const goBack = () => {
    navigation.goBack()
  }

  return (
    <TermsScreenWrapper>
      <TermsWrapper onPress={goBack}>
        <TermsPopup
          onPress={navigateToAddInterests}
          onPressTerm={navigateToTermsContent}
        />
      </TermsWrapper>
    </TermsScreenWrapper>
  )
}
