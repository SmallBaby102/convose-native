import { UserInterest } from "convose-lib/interests"

export type AuthToken = string
export type PushNotificationToken = string
export type Email = string
export type Username = string
export type Uuid = string
export type ThemeColor = string

type AvatarUrl = {
  readonly url: string
}

export type Avatar = {
  readonly display: AvatarUrl
  readonly small: AvatarUrl
  readonly thumb: AvatarUrl
  readonly url: string
}
/* eslint-disable camelcase */
export type User = UserMeta & {
  readonly authentication_token: AuthToken
  readonly updating_avatar: boolean
  readonly userActive: boolean
}

export type UserMeta = {
  readonly email: Email
  readonly interests: ReadonlyArray<UserInterest>
  readonly is_guest: boolean
  readonly last_seen: Date
  readonly avatar: Avatar
  readonly theme_color: ThemeColor
  readonly username: Username
  readonly uuid: Uuid
  readonly id: number
}
/* eslint-enable camelcase */

export type ThirdPartyUser = {
  readonly user: UserMeta
  readonly token: AuthToken
}

export enum LoginType {
  Login = "Login",
  SignUp = "Sign up",
}
