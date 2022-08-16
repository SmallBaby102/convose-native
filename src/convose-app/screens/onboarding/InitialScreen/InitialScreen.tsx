/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/style-prop-object */
import React, { FunctionComponent } from "react"
import { Routes } from "convose-lib/router"
import { font } from "convose-styles"
import { NavigationInjectedProps } from "react-navigation"

import { StatusBar } from "expo-status-bar"
import { DEFAULT_HIT_SLOP } from "convose-lib/utils"
import { Platform } from "react-native"
import { StatusBarBackground } from "../../../screens/chatbox-list/Styled"
import { Container, ConvoseLogo, LoginButton, TryOutButton } from "./Styled"
import * as RootNavigation from "../../../RootNavigation"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const convoseLogo = require("../../../../assets/convose-name.png")

export const InitialScreen: FunctionComponent<NavigationInjectedProps> = ({
  navigation,
}) => {
  React.useEffect(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      navigation.addListener("beforeRemove", (e: any) => {
        e.preventDefault()
      }),
    [navigation]
  )

  const navigateToTerms = () =>
    RootNavigation.navigate(Routes.OnboardingTerms, {})
  const navigateToLoginButtonList = () =>
    RootNavigation.navigate(Routes.AuthButtonList, { loginOrSignUp: "Login" })

  return (
    <>
      <StatusBar style="dark" />
      {Platform.OS !== "ios" && <StatusBarBackground />}
      <Container>
        <ConvoseLogo source={convoseLogo} resizeMode="contain" />
        <TryOutButton
          label="Try Convose"
          fontFamily={font.normal}
          onPress={navigateToTerms}
        />
        <LoginButton
          label="Login"
          onPress={navigateToLoginButtonList}
          type="text"
          fontFamily={font.normal}
          isTextMainBlue
          hitSlop={DEFAULT_HIT_SLOP}
        />
      </Container>
    </>
  )
}
