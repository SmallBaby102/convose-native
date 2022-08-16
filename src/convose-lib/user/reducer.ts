import { UserAction, UserActionType } from "./actions"
import { UserState } from "./state"
import { updateUserRequest, updateUserSuccess } from "./utils"

const initialUserState: UserState = {
  authentication_token: "",
  email: "",
  interests: [],
  is_guest: true,
  last_seen: new Date(),
  theme_color: "red",
  username: "",
  uuid: "",
  updating_avatar: false,
  userActive: true,
  avatar: {
    display: { url: "" },
    small: { url: "" },
    thumb: { url: "" },
    url: "",
  },
  id: NaN,
  localInterests: [],
  socialLoginType: undefined,
  isGettingExpoPushToken: false,
  expoPushToken: "",
}
// eslint-disable-next-line complexity
export const userReducer = (
  state = initialUserState,
  action: UserAction
): UserState => {
  switch (action.type) {
    case UserActionType.UpdateAvatar:
      return {
        ...state,
        updating_avatar: true,
      }

    case UserActionType.GetUserSuccess:
    case UserActionType.CreateGuestUserSuccess:
      return {
        ...state,
        ...action.payload,
      }
    case UserActionType.UpdateUser:
      return updateUserRequest(state, action.payload)
    case UserActionType.UpdateAvatarSuccess:
    case UserActionType.UpdateUserSuccess:
      return updateUserSuccess(state, action.payload)

    case UserActionType.UpdateAvatarFailure:
      return {
        ...state,
        updating_avatar: false,
      }

    case UserActionType.ChangeUsername:
      return {
        ...state,
        username: action.payload,
      }

    case UserActionType.CleanUserStateAfterSignOut:
      return initialUserState

    case UserActionType.SetUserActive:
      return {
        ...state,
        userActive: true,
      }

    case UserActionType.SetUserInactive:
      return {
        ...state,
        userActive: false,
      }
    case UserActionType.InitLocalInterests:
      return {
        ...state,
        localInterests: state.interests,
      }
    case UserActionType.OpenSocialLogin:
      return {
        ...state,
        socialLoginType: action.payload.loginType,
      }
    case UserActionType.CloseSocialLogin:
      return {
        ...state,
        socialLoginType: undefined,
      }
    case UserActionType.RegisterPushNotifications:
      return {
        ...state,
        isGettingExpoPushToken: true,
      }
    case UserActionType.RegisterPushNotificationsSuccess:
      return {
        ...state,
        expoPushToken: action.payload,
        isGettingExpoPushToken: false,
      }
    case UserActionType.RegisterPushNotificationsFailure:
      return {
        ...state,
        isGettingExpoPushToken: false,
      }
    case UserActionType.ClearPushNotification:
      return {
        ...state,
        expoPushToken: "",
      }
    case UserActionType.RequestingPushNotifications:
      return {
        ...state,
        isGettingExpoPushToken: true,
      }
    case UserActionType.RequestingPushNotificationsFailure:
      return {
        ...state,
        isGettingExpoPushToken: false,
      }
    default:
      return state
  }
}
