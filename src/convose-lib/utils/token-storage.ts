import AsyncStorage from "@react-native-async-storage/async-storage"
import { from, Observable } from "rxjs"

import { AuthToken } from "convose-lib/user"

const tokenStorageName = "token"

export const getToken = (): Observable<AuthToken | null> =>
  from(AsyncStorage.getItem(tokenStorageName))

export const setToken = (token: AuthToken): Observable<void> =>
  from(AsyncStorage.setItem(tokenStorageName, token))

export const discardToken = (): Observable<void> =>
  from(AsyncStorage.removeItem(tokenStorageName))
