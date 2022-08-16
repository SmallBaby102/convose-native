import React, { FunctionComponent, useContext } from "react"
import { Animated, StyleSheet, TouchableHighlight } from "react-native"
import { connect } from "react-redux"
import { DrawerActions, useNavigation } from "@react-navigation/native"
import { ThemeContext } from "styled-components"
import { withSafeAreaInsets } from "react-native-safe-area-context"

import { Routes } from "convose-lib/router"
import { State } from "convose-lib/store"
import { selectUnreadCountFeature } from "convose-lib/users-list"
import {
  interestsBarHeight,
  navbarBottomInset,
  softShadows,
} from "convose-styles"
import { selectShowPopup } from "convose-lib/chat"
import { OnboardingAction, selectAddInterestExplainer } from "convose-lib"
import { selectIsGuest } from "convose-lib/user"
import { SafeAreaProps } from "convose-lib/generalTypes"
import InboxIcon from "../../../assets/Icons/components/InboxIcon"
import {
  NavActionContainer,
  NavActionTitle,
  NavbarView,
  SearchInterestsButton,
  Styles,
  WhiteBackgroundBar,
} from "./Styled"
import { IconBadge, IconBadgeTriangle, Explainer } from "../../components"
import ProfileIcon from "../../../assets/Icons/components/ProfileIcon"
import { ExplainerIcons } from "./ExplainerIcons"

type DispatchToProps = {
  readonly hideAddInterestExplainer: () => void
}
type NavbarProps = {
  readonly unreadMessagesCount: number
  readonly showPopup: boolean
  readonly showingAddInterestExplainer: boolean
  readonly isGuest: boolean
}
type AllProps = NavbarProps & DispatchToProps & SafeAreaProps
type Nav = {
  navigate: (value: string) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dispatch: any
}
const styles = StyleSheet.create({
  button: {
    width: 90,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
})
const ICON_WIDTH = "30"
const ICON_HEIGHT = "30"

export const NavbarComponent: FunctionComponent<AllProps> = ({
  unreadMessagesCount,
  showPopup,
  showingAddInterestExplainer,
  isGuest,
  hideAddInterestExplainer,
  insets,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const theme: any = useContext(ThemeContext)
  const navigation = useNavigation<Nav>()
  const tryHideExplainer = (): void => {
    if (showingAddInterestExplainer) {
      hideAddInterestExplainer()
    }
  }
  const navigateToProfile = () => {
    tryHideExplainer()
    navigation.dispatch(DrawerActions.openDrawer())
  }
  const navigateToInbox = () => {
    tryHideExplainer()
    navigation.navigate(Routes.Inbox)
  }
  const animatedValue = new Animated.Value(0)
  const interpolateOpacity = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
  })

  if (showPopup) {
    Animated.sequence([
      Animated.timing(animatedValue, {
        duration: 500,
        toValue: 100,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(animatedValue, {
        duration: 500,
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start()
  }
  const insetsBottom = insets?.bottom ? navbarBottomInset : 0

  return (
    <>
      <Explainer
        explanation="Add languages, locations, skills, hobbies, etc here to find interesting people."
        isShowing={showingAddInterestExplainer}
        iconComponent={<ExplainerIcons />}
        bottomPosition={interestsBarHeight + 23 + insetsBottom}
        onClosePress={tryHideExplainer}
        // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
        wrapperStyle={{
          paddingRight: "21%",
          paddingLeft: "21%",
        }}
      />
      <WhiteBackgroundBar style={softShadows} bottomInset={insetsBottom} />
      <NavbarView bottomInset={insetsBottom}>
        <IconBadgeTriangle opacity={interpolateOpacity} />
        <>
          <TouchableHighlight
            onPress={navigateToProfile}
            style={styles.button}
            underlayColor={theme.ButtonOnPress}
          >
            <NavActionContainer>
              <ProfileIcon width={ICON_WIDTH} height={ICON_HEIGHT} />
              <NavActionTitle>{isGuest ? "Sign in" : "Profile"}</NavActionTitle>
            </NavActionContainer>
          </TouchableHighlight>
        </>
        <SearchInterestsButton
          bottomInset={insetsBottom}
          style={Styles.searchInterestShadow}
        />
        <>
          {unreadMessagesCount > 0 ? (
            <TouchableHighlight
              onPress={navigateToInbox}
              style={styles.button}
              underlayColor={theme.ButtonOnPress}
            >
              <NavActionContainer>
                <IconBadge>
                  <InboxIcon width={ICON_WIDTH} height={ICON_HEIGHT} />
                </IconBadge>
                <NavActionTitle>Inbox</NavActionTitle>
              </NavActionContainer>
            </TouchableHighlight>
          ) : (
            <TouchableHighlight
              onPress={navigateToInbox}
              style={styles.button}
              underlayColor={theme.ButtonOnPress}
            >
              <NavActionContainer>
                <InboxIcon width={ICON_WIDTH} height={ICON_HEIGHT} />
                <NavActionTitle>Inbox</NavActionTitle>
              </NavActionContainer>
            </TouchableHighlight>
          )}
        </>
      </NavbarView>
    </>
  )
}

const mapStateToProps = (state: State) => ({
  unreadMessagesCount: selectUnreadCountFeature(state),
  showPopup: selectShowPopup(state),
  showingAddInterestExplainer: selectAddInterestExplainer(state),
  isGuest: selectIsGuest(state),
})

export const Navbar = withSafeAreaInsets(
  connect(mapStateToProps, {
    hideAddInterestExplainer: OnboardingAction.hideAddInterestExplainer,
  })(NavbarComponent)
)
