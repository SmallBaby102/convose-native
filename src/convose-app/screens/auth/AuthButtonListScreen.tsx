/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { PureComponent } from "react"
import {
  StatusBar,
  TouchableWithoutFeedback,
  StyleSheet,
  BackHandler,
} from "react-native"

import { StackScreenProps } from "@react-navigation/stack"
import { Routes } from "convose-lib/router"
import { RootStackParamList } from "../../router"
import { AuthButtonList, TouchableWithoutFeedbackArea } from "../../components"
import * as RootNavigation from "../../RootNavigation"

type NavProps = StackScreenProps<RootStackParamList, Routes.AuthButtonList>

type AutButtonScreenType = NavProps

const styles = StyleSheet.create({
  wrapper: { backgroundColor: "rgba(0, 0, 0, 0.35)" },
  iosButton: {
    width: "88%",
    maxWidth: 500,
    height: 57,
    marginVertical: 6,
    alignSelf: "center",
  },
})

export class AuthButtonListScreenComponent extends PureComponent<AutButtonScreenType> {
  componentDidMount(): void {
    BackHandler.addEventListener("hardwareBackPress", this.onBackPress)
  }

  componentWillUnmount(): void {
    BackHandler.removeEventListener("hardwareBackPress", this.onBackPress)
  }

  public onAuthCompleted = (): void => {
    RootNavigation.navigate(Routes.MainScreen, {})
  }

  public onBackPress = (): boolean => {
    RootNavigation.goBack()
    return true
  }

  public render(): React.ReactNode {
    const { route } = this.props
    const { loginOrSignUp } = route.params

    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="rgba(0,0,0,.35)" />
        <TouchableWithoutFeedback onPress={this.onBackPress}>
          <TouchableWithoutFeedbackArea style={styles.wrapper} />
        </TouchableWithoutFeedback>
        <AuthButtonList
          loginOrSignUp={loginOrSignUp}
          onAuthCompleted={this.onAuthCompleted}
        />
      </>
    )
  }
}

export const AuthButtonListScreen = AuthButtonListScreenComponent
