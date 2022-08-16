/* eslint-disable @typescript-eslint/no-explicit-any, import/no-extraneous-dependencies */
import {
  StackActions,
  createNavigationContainerRef,
} from "@react-navigation/native"
import { NavigationAction } from "@react-navigation/routers"

export const navigationRef = createNavigationContainerRef()

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function navigate(name: string, params: any): void {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params)
  }
}

export function push(name: string, ...args: any[]): void {
  navigationRef.current?.dispatch(StackActions.push(name, ...args))
}

export function goBack(): void {
  navigationRef.current?.goBack()
}

export function dispatch(action: NavigationAction): void {
  navigationRef.current?.dispatch(action)
}
