import React, { PureComponent } from "react"
import { connect } from "react-redux"

import { selectAuthFeature } from "convose-lib/auth"
import { State } from "convose-lib/store"
import { Routes } from "convose-lib/router"
import AuthFormPure from "./AuthFormPure"
import { AuthFormProps, AuthFormState, StateToProps } from "./types"
import * as RootNavigation from "../../RootNavigation"

export class AuthFormComponent extends PureComponent<
  AuthFormProps,
  AuthFormState
> {
  public readonly state: AuthFormState = {
    email: "",
    password: "",
  }

  public readonly handleFormSubmit = (): void => {
    requestAnimationFrame(() => {
      const { onSubmit } = this.props
      const { email, password } = this.state

      onSubmit(email.trim(), password)
    })
  }

  public readonly handleForgotPassword = (): void => {
    requestAnimationFrame(() => {
      // TODO: forgot password function
      RootNavigation.navigate(Routes.ForgetPassword, null)
    })
  }

  public readonly onEmailChange = (email: string): void => {
    this.setState({ email: email.toLocaleLowerCase() })
  }

  public readonly onPasswordChange = (password: string): void => {
    this.setState({ password })
  }

  public render(): React.ReactNode {
    const { email, password } = this.state
    const {
      type,
      auth: { loading },
    } = this.props

    return (
      <AuthFormPure
        type={type}
        email={email}
        password={password}
        isLoading={loading}
        onSubmit={this.handleFormSubmit}
        onEmailChange={this.onEmailChange}
        onPasswordChange={this.onPasswordChange}
        onForgotPassword={this.handleForgotPassword}
      />
    )
  }
}

const mapStateToProps = (state: State): StateToProps => ({
  auth: selectAuthFeature(state),
})

export const AuthForm = connect(mapStateToProps)(AuthFormComponent)
