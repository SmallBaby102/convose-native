import { UserInterest } from "convose-lib/interests"
import { LoginType, PushNotificationToken, User } from "./dto"

export type UserState = User & {
  localInterests: ReadonlyArray<UserInterest>
  socialLoginType?: LoginType
  isGettingExpoPushToken: boolean
  expoPushToken: PushNotificationToken
}
