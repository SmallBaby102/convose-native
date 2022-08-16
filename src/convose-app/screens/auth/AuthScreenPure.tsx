/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FunctionComponent, useContext } from "react"
import { KeyboardAvoidingView } from "react-native"
import { ThemeContext } from "styled-components"
import { AuthForm } from "../../components"
import { BackButton, StyledScrollView, styles, Title } from "./styled"
import { AuthScreenPurePops } from "./types"

const AuthScreenPure: FunctionComponent<AuthScreenPurePops> = ({
  type,
  onBack,
  onSubmit,
}) => {
  const theme: any = useContext(ThemeContext)
  return (
    <StyledScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <BackButton
        name="ios-chevron-back"
        iconColor={theme.mainBlue}
        onPress={onBack}
        size={30}
      />
      <KeyboardAvoidingView behavior="padding">
        <Title>{type}</Title>
        <AuthForm type={type} onSubmit={onSubmit} />
      </KeyboardAvoidingView>
    </StyledScrollView>
  )
}

export default AuthScreenPure
