import React, { FunctionComponent, useRef, useContext } from "react"

import { Routes } from "convose-lib/router"
import { ThemeContext } from "styled-components"
import { PrimaryButton, UserTextInput } from "../../components"
import {
  ForgotPasswordText,
  FormWrapper,
  LoadingSpinner,
  SubmitButton,
} from "./styled"
import { AuthFormPureProps } from "./types"

const AuthFormPure: FunctionComponent<AuthFormPureProps> = ({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  type,
  isLoading,
  onSubmit,
  onForgotPassword,
}) => {
  let passwordRef = useRef()

  const renderForgotPasswordButton = () => {
    const forgotPasswordComponent = (
      <ForgotPasswordText>forgot password</ForgotPasswordText>
    )

    return (
      <PrimaryButton
        type="text"
        children={forgotPasswordComponent}
        label="forgot password"
        onPress={onForgotPassword}
      />
    )
  }
  const focusPassword = () => {
    passwordRef.inputRef && passwordRef.inputRef.current.focus()
  }

  const setRef = (ref: any) => {
    passwordRef = ref
  }

  const theme = useContext(ThemeContext)

  return (
    <FormWrapper>
      <UserTextInput
        autoCapitalize="none"
        placeholder="e-mail"
        onTextChange={onEmailChange}
        value={email}
        autoCompleteType="email"
        enablesReturnKeyAutomatically
        keyboardType="email-address"
        returnKeyLabel="next"
        returnKeyType="next"
        selectTextOnFocus
        onSubmitEditing={focusPassword}
      />
      <UserTextInput
        autoCapitalize="none"
        placeholder="password"
        secure
        onTextChange={onPasswordChange}
        value={password}
        autoCompleteType="password"
        blurOnSubmit
        enablesReturnKeyAutomatically
        returnKeyLabel="done"
        returnKeyType="done"
        selectTextOnFocus
        onSubmitEditing={onSubmit}
        getRef={setRef}
      />
      {type === Routes.Login && renderForgotPasswordButton()}
      {isLoading ? (
        <LoadingSpinner color={theme.mainBlue} />
      ) : (
        <SubmitButton label={type} onPress={onSubmit} />
      )}
    </FormWrapper>
  )
}

export default AuthFormPure
