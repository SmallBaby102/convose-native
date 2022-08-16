/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from "react"
import { LayoutAnimation, Platform, UIManager } from "react-native"
import { FontAwesome5 } from "@expo/vector-icons"
import * as AppleAuthentication from "expo-apple-authentication"
import * as GoogleSignIn from "expo-google-sign-in"
import _ from "lodash"
import { LoginType, selectUserFeature, User } from "convose-lib/user"
import { AuthAction, selectAuthLoading, State } from "convose-lib"
import { connect } from "react-redux"
import * as Facebook from "expo-facebook"
import {
  AnimationContainer,
  ButtonListWrapper,
  ButtonWrapper,
  Label,
} from "./styled"
import { ConvoseLoading } from ".."
import * as RootNavigation from "../../RootNavigation"
import { convoseAlertRef } from "../../RootConvoseAlert"

type StateToPropsType = {
  readonly user: User
  readonly authLoading: boolean
}

type DispatchToProps = {
  readonly authThirdParty: (response: any) => void
  readonly authThirdPartyRequest: () => void
  readonly authThirdPartyRequestCancel: () => void
}
type AutButtonScreenType = {
  loginOrSignUp: string | undefined
  onAuthCompleted: () => void
  onHideComponent?: () => void
  useAnimation?: boolean
  showButtonsOnAnimationUse?: boolean
}
type AllProps = AutButtonScreenType & StateToPropsType & DispatchToProps

const googleSignInConfig =
  Platform.OS === "android"
    ? {
        webClientId:
          "796340311974-8974bio8u1mmebhmtfrci7men07a5nme.apps.googleusercontent.com",
      }
    : {
        clientId:
          "796340311974-c7ojtdmebrv20k16kq4pn3tq291j0p25.apps.googleusercontent.com",
      }
const LOGIN_ITEM_HEIGHT = 75
const LOGIN_PANEL_HEIGHT_BASE = 3 * LOGIN_ITEM_HEIGHT + 100
const LOGIN_PANEL_HEIGHT =
  Platform.OS === "android"
    ? LOGIN_PANEL_HEIGHT_BASE
    : LOGIN_PANEL_HEIGHT_BASE + LOGIN_ITEM_HEIGHT

// const mutationLayout = {
//   duration: 100,
//   type: LayoutAnimation.Types.easeInEaseOut,
//   property: LayoutAnimation.Properties.scaleY,
// }
const layoutAnimConfig = {
  duration: 100,
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.scaleY,
  },
  // delete: mutationLayout,
  // create: mutationLayout,
}

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}
class AuthButtonListComponent extends Component<AllProps> {
  public shouldComponentUpdate(prevProps: AllProps): boolean {
    return !_.isEqual(this.props, prevProps)
  }

  public componentDidUpdate(prevProps: AllProps): void {
    const { user, onAuthCompleted, showButtonsOnAnimationUse } = this.props
    if (
      prevProps.user.uuid !== user.uuid ||
      prevProps.user.is_guest !== user.is_guest
    ) {
      onAuthCompleted()
    }
    if (prevProps.showButtonsOnAnimationUse !== showButtonsOnAnimationUse) {
      LayoutAnimation.configureNext(layoutAnimConfig)
    }
  }

  public readonly loginWithGoogle = async (): Promise<void> => {
    const { authThirdPartyRequest, authThirdPartyRequestCancel } = this.props
    await GoogleSignIn.initAsync(googleSignInConfig)
    try {
      authThirdPartyRequest()
      await GoogleSignIn.askForPlayServicesAsync()
      const { type, user } = await GoogleSignIn.signInAsync()
      if (type === "cancel") {
        authThirdPartyRequestCancel()
      }
      if (type === "success") {
        const { authThirdParty } = this.props
        const json: { idToken: string | null | undefined } = {
          idToken: user && user.auth ? user.auth.idToken : null,
        }
        authThirdParty(json)
      }
    } catch ({ message }) {
      convoseAlertRef?.show({
        ioniconName: "ios-logo-google",
        title: `Google Login`,
        description: `Google Login Error: ${message}`,
      })
      authThirdPartyRequestCancel()
    }
  }

  public readonly loginWithFacebook = async (): Promise<void> => {
    const { authThirdPartyRequest, authThirdPartyRequestCancel } = this.props
    try {
      await Facebook.initializeAsync("853466218454989")
      authThirdPartyRequest()
      const facebookLoginResponse = await Facebook.logInWithReadPermissionsAsync(
        {
          permissions: ["email", "public_profile"],
        }
      )
      if (facebookLoginResponse.type === "cancel") {
        authThirdPartyRequestCancel()
      }
      if (facebookLoginResponse.type === "success") {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?fields=name,email,picture.width(200).height(200)&access_token=${facebookLoginResponse.token}`
        )
        const json: any = await response.json()
        json.accessToken = facebookLoginResponse.token
        const { authThirdParty } = this.props
        authThirdParty(json)
      }
      // type === 'cancel'
    } catch ({ message }) {
      convoseAlertRef?.show({
        ioniconName: "ios-logo-facebook",
        title: `Facebook Login`,
        description: `Facebook Login Error: ${message}`,
      })
      authThirdPartyRequestCancel()
    }
  }

  public readonly loginWithApple = async (): Promise<void> => {
    const { authThirdPartyRequest, authThirdPartyRequestCancel } = this.props
    try {
      authThirdPartyRequest()
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })
      const { authThirdParty } = this.props
      authThirdParty(credential)
      // signed in
    } catch (e: any) {
      authThirdPartyRequestCancel()
      if (e.code === "ERR_CANCELED") {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  }

  public renderButtons = (component: React.ReactElement): React.ReactNode => {
    const { useAnimation, showButtonsOnAnimationUse } = this.props
    if (!useAnimation) {
      return component
    }
    return (
      <AnimationContainer
        isVisible={!!showButtonsOnAnimationUse}
        maxHeight={LOGIN_PANEL_HEIGHT}
      >
        {component}
      </AnimationContainer>
    )
  }

  public render(): React.ReactNode {
    const { user, authLoading, loginOrSignUp, onHideComponent } = this.props
    if (!user.is_guest) {
      return null
    }
    const loginButtons = [
      {
        icon: "envelope",
        label: `with Email`,
        onPress: () => {
          !!onHideComponent && onHideComponent()
          RootNavigation.navigate(loginOrSignUp || LoginType.Login, {})
        },
      },
      {
        icon: "google",
        label: `with Google`,
        onPress: this.loginWithGoogle,
        color: "#df4931",
      },
      {
        icon: "facebook-f",
        label: `with Facebook`,
        onPress: this.loginWithFacebook,
        color: "#1874EB",
      },
    ]
    if (
      Platform.OS === "ios" &&
      parseInt(Platform.Version.toString(), 10) >= 13
    ) {
      loginButtons.push({
        icon: "apple",
        label: `with Apple`,
        onPress: this.loginWithApple,
        color: "black",
      })
    }

    return (
      <>
        <ConvoseLoading isShowing={authLoading} />
        {this.renderButtons(
          <ButtonListWrapper>
            {loginButtons.map((login) => (
              <ButtonWrapper
                key={login.icon}
                color={login.color}
                onPress={login.onPress}
              >
                <FontAwesome5 name={login.icon} size={20} color="white" />
                <Label>
                  {loginOrSignUp} {login.label}
                </Label>
              </ButtonWrapper>
            ))}
          </ButtonListWrapper>
        )}
      </>
    )
  }
}

const mapStateToProps = (state: State): StateToPropsType => ({
  user: selectUserFeature(state),
  authLoading: selectAuthLoading(state),
})
// AuthButtonListComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "AuthButtonListComponent",
//   diffNameColor: "red",
// }

export const AuthButtonList: React.FunctionComponent<AutButtonScreenType> = connect(
  mapStateToProps,
  {
    authThirdParty: AuthAction.authThirdParty,
    authThirdPartyRequest: AuthAction.authThirdPartyRequest,
    authThirdPartyRequestCancel: AuthAction.authThirdPartyRequestCancel,
  }
)(AuthButtonListComponent)
