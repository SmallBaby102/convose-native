/* eslint-disable import/no-extraneous-dependencies */
import { Observable } from "rxjs"
import { AjaxError } from "rxjs/ajax"
import { map } from "rxjs/operators"

import { ENDPOINTS, get, patch, post, post$ } from "convose-lib/api"
import { ChatUser } from "convose-lib/chat"
import { logEvent } from "convose-lib/services"
import { AuthToken, PushNotificationToken, User } from "./dto"

interface IProfile<T> {
  readonly profile: Partial<T>
}

export const createGuestUser = (): Observable<User> =>
  post<{ readonly user: User }, null>(ENDPOINTS.CREATE_GUEST, null, {
    withCredentials: true,
  }).pipe(map(({ user }: { readonly user: User }) => user))

export const getUser = (Authorization: AuthToken): Observable<User> =>
  get<User>(ENDPOINTS.USER_PROFILE, { Authorization, withCredentials: true })

export const updateUser = (
  payload: Partial<User>,
  Authorization: AuthToken
): Observable<User> => {
  logEvent("updatedProfile")

  return patch<User, IProfile<User>>(
    ENDPOINTS.USER_PROFILE,
    { profile: payload },
    { Authorization, withCredentials: true }
  )
}

export const updateAvatar = (
  payload: FormData,
  Authorization: AuthToken
): Observable<User> =>
  post$(ENDPOINTS.UPDATE_PROFILE, payload, { Authorization })

export const setUserActive = (
  Authorization: AuthToken
): Observable<null | AjaxError> =>
  post(ENDPOINTS.USER_ACTIVE, null, { Authorization, withCredentials: true })

export const setUserInactive = (
  Authorization: AuthToken
): Observable<null | AjaxError> =>
  post(ENDPOINTS.USER_INACTIVE, null, { Authorization, withCredentials: true })

export const blockUser = (
  blacklistedUser: ChatUser,
  Authorization: AuthToken
): Observable<null | AjaxError> =>
  post(
    ENDPOINTS.BLACKLIST_USER,
    { user_uuid: blacklistedUser.uuid },
    { Authorization, withCredentials: true }
  )
export const registerPushNotifications = (
  expoPushToken: PushNotificationToken,
  Authorization: AuthToken
): Observable<null | AjaxError> => {
  return post(
    ENDPOINTS.PUSH_ENDPOINT,
    { push_token: expoPushToken, os: "expo" },
    { Authorization, withCredentials: true }
  )
}

// export const registerPushNotifications = (authorization: AuthToken): Observable<void> => {
//     from(registerForPushNotificationsAsync()).pipe(
//         map(response => console.log('Response', response)),
//         catchError(err => {
//             console.log(err)
//             return of([])
//         }),
//     )

//     return from([])
// }

// post(
//     ENDPOINTS.EXPO_TOKEN,
//     { push_token: response.token, os: 'expo' },
//     {
//         authorization,
//         withCredentials: true,
//     },
// ),
