/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from "rxjs"

import { _delete, ENDPOINTS, post, get } from "convose-lib/api"
import { AuthToken } from "convose-lib/user"

import * as GoogleSignIn from "expo-google-sign-in"

export const signUpUser = (
  email: string,
  password: string,
  Authorization: AuthToken
): Observable<any> =>
  post(
    ENDPOINTS.SIGN_UP,
    {
      user: { email, password, password_confirmation: password },
    },
    { Authorization }
  )

export const signInUser = (email: string, password: string): Observable<any> =>
  post(ENDPOINTS.SIGN_IN, { user: { email, password } })

export const signOutUser = (Authorization: AuthToken): Observable<any> => {
  GoogleSignIn.signOutAsync()
  return _delete(ENDPOINTS.SIGN_OUT, { Authorization })
}
export const authThirdParty = (
  response: any,
  Authorization: AuthToken
): Observable<any> =>
  // eslint-disable-next-line no-nested-ternary
  response.hasOwnProperty("accessToken")
    ? get(`${ENDPOINTS.FACEBOOK_LOGIN}?oauth_token=${response.accessToken}`, {
        Authorization,
      })
    : response.hasOwnProperty("idToken")
    ? get(`${ENDPOINTS.GOOGLE_LOGIN}?jwt=${response.idToken}`, {
        Authorization,
      })
    : get(`${ENDPOINTS.APPLE_LOGIN}?jwt=${response.identityToken}`, {
        Authorization,
      })

export const forgetPassword = (email: string): Observable<any> =>
  post(ENDPOINTS.FORGET_PASSWORD, { email })
