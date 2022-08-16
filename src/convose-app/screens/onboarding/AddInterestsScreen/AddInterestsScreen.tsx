/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/style-prop-object */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FunctionComponent, useContext, useEffect } from "react"
import { NavigationInjectedProps } from "react-navigation"
import { connect, useDispatch } from "react-redux"
import { UserInterest } from "convose-lib/interests"
import { State } from "convose-lib/store"
import { selectUserInterests } from "convose-lib/user"
import { ONBOARD_USER_INTERESTS } from "convose-lib/utils"

import { OnboardingAction } from "convose-lib/onboarding"
import { StatusBar } from "expo-status-bar"
import { Platform } from "react-native"
import { ThemeContext } from "styled-components"
import { Routes } from "convose-lib/router"
import { BackButton } from "../../../screens/auth/styled"
import {
  AddInterestButton,
  Container,
  StyledScrollView,
  StyledText,
  StyledView,
  styles,
  Title,
  WidthWrapper,
} from "./Styled"
import { StatusBarBackground } from "../../chatbox-list/Styled"
import { MyInterestList } from "../../../components"

type AddInterestsScreenProps = NavigationInjectedProps & {
  readonly userInterests: ReadonlyArray<UserInterest>
}

export const AddInterestsScreenComponent: FunctionComponent<AddInterestsScreenProps> = ({
  navigation,
  userInterests,
}) => {
  const dispatch = useDispatch()
  useEffect(() => {
    userInterests.length >= ONBOARD_USER_INTERESTS
      ? dispatch(OnboardingAction.hideOnboarding()) &&
        navigation.navigate(Routes.MainScreen,{})
      : null
  }, [userInterests])

  const goBack = () => navigation.goBack()

  const interestsLeft = ONBOARD_USER_INTERESTS - userInterests.length

  const titleText = `Add ${interestsLeft}${
    interestsLeft < ONBOARD_USER_INTERESTS ? " more" : ""
  } interests to your profile`
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const theme: any = useContext(ThemeContext)
  return (
    <StyledScrollView contentContainerStyle={styles.scrollContainer}>
      <StatusBar style="dark" />
      {Platform.OS !== "ios" && <StatusBarBackground />}
      <StyledView>
        <Container>
          <WidthWrapper>
            <Title>
              {interestsLeft > 0
                ? titleText
                : "That's it, keep adding your interests"}
            </Title>
          </WidthWrapper>

          <WidthWrapper>
            <StyledText>
              (Include your location, language, skills, hobbies, sports, etc)
            </StyledText>
          </WidthWrapper>

          <AddInterestButton />
          <MyInterestList onlyList />
        </Container>
      </StyledView>
      <BackButton
        name="ios-chevron-back"
        onPress={goBack}
        size={30}
        iconColor={theme.mainBlue}
        top={27}
        left={25}
      />
    </StyledScrollView>
  )
}

const mapStateToProps = (state: State) => ({
  userInterests: selectUserInterests(state),
})

export const AddInterestsScreen = connect(mapStateToProps)(
  AddInterestsScreenComponent
)
