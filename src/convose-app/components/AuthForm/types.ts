import { NavigationInjectedProps } from "react-navigation"

import { AuthState } from "convose-lib/auth"

export type AuthFormPureProps = {
  readonly type: string
  readonly email: string
  readonly password: string
  readonly isLoading: boolean
  readonly onSubmit: (email: string, password: string) => void
  readonly onEmailChange: (email: string) => void
  readonly onPasswordChange: (password: string) => void
  readonly onForgotPassword: () => void
}

export type Props = {
  readonly type: string
  readonly onSubmit: (email: string, password: string) => void
}

export type StateToProps = {
  readonly auth: AuthState
}

export type AuthFormState = {
  readonly email: string
  readonly password: string
}

export type AuthFormProps = Props &
  StateToProps &
  Partial<NavigationInjectedProps>
