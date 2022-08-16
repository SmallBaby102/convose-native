import React, { Component } from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux"

import { AuthAction } from "convose-lib/auth"
import { Routes } from "convose-lib/router"
import { State } from "convose-lib/store"
import { selectUserFeature } from "convose-lib/user"

import AuthScreenPure from "./AuthScreenPure"
import { AuthScreenProps, DispatchToProps, StateToProps } from "./types"
import * as RootNavigation from "../../RootNavigation"

export class AuthScreenContainer extends Component<AuthScreenProps> {
  public componentDidUpdate(prevProps: AuthScreenProps): void {
    const { user } = this.props
    if (
      prevProps.user.uuid !== user.uuid ||
      prevProps.user.is_guest !== user.is_guest
    ) {
      RootNavigation.navigate(Routes.MainScreen, {})
    }
  }

  public componentWillUnmount(): void {
    const { removeAuthErrors } = this.props
    removeAuthErrors("")
  }

  public readonly getOnSubmit = (): ((
    email: string,
    password: string
  ) => void) => {
    const { signUpUser, signInUser, route } = this.props
    const routeName = route.name
    return routeName === Routes.Login ? signInUser : signUpUser
  }

  public readonly goBack = (): void => {
    const { navigation } = this.props
    navigation.goBack()
  }

  public render(): React.ReactNode {
    const { route } = this.props
    return (
      <AuthScreenPure
        type={route.name}
        onBack={this.goBack}
        onSubmit={this.getOnSubmit()}
      />
    )
  }
}

const mapStateToProps = (state: State): StateToProps => ({
  user: selectUserFeature(state),
})

const mapDispatchToProps = (
  dispatch: Dispatch<AuthAction>
): DispatchToProps => ({
  removeAuthErrors: (error: string) =>
    dispatch(AuthAction.setAuthErrors(error)),
  signInUser: (email: string, password: string) =>
    dispatch(AuthAction.signInUser(email, password)),
  signUpUser: (email: string, password: string) =>
    dispatch(AuthAction.signUpUser(email, password)),
})

export const AuthScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthScreenContainer)
