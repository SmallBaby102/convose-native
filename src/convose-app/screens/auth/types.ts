// import { NavigationInjectedProps } from 'react-navigation'

import { User } from "convose-lib/user"
import { StackScreenProps } from "@react-navigation/stack"
import { MainStackParamList } from "convose-app"
import { Routes } from "convose-lib/router"

type NavProps = StackScreenProps<MainStackParamList, Routes.Login>

export type AuthScreenPurePops = {
  readonly type: string
  readonly onBack: () => void
  readonly onSubmit: (email: string, password: string) => void
}

export type StateToProps = {
  readonly user: User
}

export type DispatchToProps = {
  readonly signUpUser: (email: string, password: string) => void
  readonly signInUser: (email: string, password: string) => void
  readonly removeAuthErrors: (errors: string) => void
}

export type AuthScreenProps = DispatchToProps & StateToProps & NavProps
