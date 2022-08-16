import React from "react"
import { ScrollView } from "react-native"
import { withSafeAreaInsets } from "react-native-safe-area-context"
import _ from "lodash"

import { connect } from "react-redux"
import { Dispatch } from "redux"
import { AuthAction, OnboardingAction, State } from "convose-lib"
import { Routes } from "convose-lib/router"
import {
  LoginType,
  selectUserFeature,
  User,
  UserAction,
} from "convose-lib/user"
import { color } from "convose-styles"
import { AppAction, selectIsDarkMode } from "convose-lib/app"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { DrawerActions } from "@react-navigation/native"
import { SafeAreaProps } from "convose-lib/generalTypes"
import { convoseAlertRef } from "../../RootConvoseAlert"
import {
  AuthButton,
  AuthButtonsWrapper,
  SectionLabel,
  ProfileScreenWrapper,
  ProfileContainer,
} from "./styled"
import { MyInterestList, ProfileHeader, ProfileFooter } from "../../components"
import * as RootNavigation from "../../RootNavigation"
import { CloseKeyboard } from "./CloseKeyboard"

type StateToPropsType = {
  readonly user: User
  readonly darkMode: boolean | null
}

type DispatchToPropsType = {
  readonly signOutUser: () => void
  readonly showOnboarding: () => void
  readonly changeTheme: (darkMode: boolean) => void
  readonly openSocialLogin: (loginType: LoginType) => void
}

type ProfileScreenProps = StateToPropsType & DispatchToPropsType & SafeAreaProps

class ProfileScreenComponent extends React.Component<ProfileScreenProps> {
  private scrollViewRef!: ScrollView

  public shouldComponentUpdate(prevProps: ProfileScreenProps): boolean {
    return !_.isEqual(this.props, prevProps)
  }

  onLogout = async () => {
    const { signOutUser, showOnboarding } = this.props
    this.scrollViewRef?.scrollTo({ y: 0, animated: true })
    await signOutUser()
    await showOnboarding()
    RootNavigation.dispatch(DrawerActions.closeDrawer())
    RootNavigation.navigate(Routes.MainScreen, {})
  }

  onLogoutPress = (): void => {
    convoseAlertRef?.show({
      ioniconName: "ios-exit-outline",
      title: "Are you sure you want to logout?",
      buttons: [
        {
          title: "Logout",
          onPress: this.onLogout,
        },
        {
          title: "Cancel",
          type: "cancel",
        },
      ],
    })
  }

  onToggleTheme = (darkTheme: boolean) => {
    const { changeTheme } = this.props
    changeTheme(darkTheme)
    const navBarColor = darkTheme ? color.darkLevel1 : color.white
    changeNavigationBarColor(navBarColor, !darkTheme, true)
  }

  renderAuthButtons = () => {
    const { openSocialLogin } = this.props
    return (
      <AuthButtonsWrapper>
        <SectionLabel>Sync your account</SectionLabel>
        <AuthButton
          label={Routes.SignUp}
          onPress={() =>
            // RootNavigation.navigate(Routes.AuthButtonList, {
            //   loginOrSignUp: Routes.SignUp,
            // })
            openSocialLogin(LoginType.SignUp)
          }
        />
        <AuthButton
          label={Routes.Login}
          onPress={() =>
            // RootNavigation.navigate(Routes.AuthButtonList, {
            //   loginOrSignUp: Routes.Login,
            // })
            openSocialLogin(LoginType.Login)
          }
          type="outline"
          isTextMainBlue
        />
      </AuthButtonsWrapper>
    )
  }

  render(): React.ReactNode {
    const { insets, user, darkMode } = this.props
    return (
      <ProfileScreenWrapper
        ref={(ref: ScrollView) => {
          this.scrollViewRef = ref
        }}
        showsVerticalScrollIndicator={false}
      >
        <CloseKeyboard />
        <ProfileContainer insetTop={insets?.top} insetBottom={insets?.bottom}>
          <ProfileHeader />
          <MyInterestList />
          {user.is_guest && this.renderAuthButtons()}
          <ProfileFooter
            user={user}
            darkMode={darkMode}
            changeTheme={this.onToggleTheme}
            logOut={this.onLogoutPress}
          />
        </ProfileContainer>
      </ProfileScreenWrapper>
    )
  }
}

const mapStateToProps = (state: State): StateToPropsType => {
  const user = _.omit(selectUserFeature(state), ["socialLoginType"])
  return {
    user,
    darkMode: selectIsDarkMode(state),
  }
}
const mapDispatchToProps = (dispatch: Dispatch): DispatchToPropsType => ({
  signOutUser: () => dispatch(AuthAction.signOutUser()),
  showOnboarding: () => dispatch(OnboardingAction.showOnboarding()),
  changeTheme: (darkMode: boolean) => dispatch(AppAction.changeTheme(darkMode)),
  openSocialLogin: (loginType: LoginType) =>
    dispatch(UserAction.openSocialLogin(loginType)),
})
// ProfileScreenComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "ProfileScreenComponent",
//   diffNameColor: "red",
// }
export const ProfileScreen = withSafeAreaInsets(
  connect(mapStateToProps, mapDispatchToProps)(ProfileScreenComponent)
)
