/* eslint-disable import/no-extraneous-dependencies */
import * as React from "react"
import { KeyboardAvoidingView, Platform, View } from "react-native"
import { color } from "convose-styles"
import { connect } from "react-redux"
import { NavigationInjectedProps } from "react-navigation"
import { useState } from "react"
import { AuthAction } from "convose-lib"
import { Dispatch } from "redux"
import { UserTextInput } from "../../components/UserTextInput"
import { FormWrapper, SubmitButton } from "../../components/AuthForm/styled"
import { AuthScreenPurePops } from "../auth/types"
import { StyledScrollView, styles, BackButton, Title } from "../auth/styled"

export type ForgetPasswordProps = {
  readonly type: string
  readonly email: string
  readonly onSubmit: (email: string, password: string) => void
  readonly onEmailChange: (email: string) => void
}
type DispatchToProps = {
  readonly forgetPassword: (email: string) => void
}

export const ForgetPasswordScreenComponent: React.FunctionComponent<
  AuthScreenPurePops &
    ForgetPasswordProps &
    NavigationInjectedProps &
    DispatchToProps
> = ({ navigation, forgetPassword }) => {
  const [submited, setSubmitted] = useState(false)
  const [email, setEmail] = useState("")

  const handleFormSubmit = () => {
    requestAnimationFrame(() => {
      forgetPassword(email)
      setSubmitted(true)
    })
  }
  const onEmailChange = (newEmail: string) => {
    setEmail(newEmail)
  }

  return (
    <StyledScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
      <BackButton
        name="md-arrow-back"
        iconColor={color.black}
        onPress={() => {
          navigation.goBack()
        }}
        size={30}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "position"}
        keyboardVerticalOffset={100}
      >
        {submited === false ? (
          <View>
            <Title>Enter your email</Title>
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
              />
              <SubmitButton label="Continue" onPress={handleFormSubmit} />
            </FormWrapper>
          </View>
        ) : (
          <Title>
            An email has been sent to your account. Please click the link there
            to reset your password.
          </Title>
        )}
      </KeyboardAvoidingView>
    </StyledScrollView>
  )
}

const mapDispatchToProps = (
  dispatch: Dispatch<AuthAction>
): DispatchToProps => ({
  forgetPassword: (email: string) => dispatch(AuthAction.forgetPassword(email)),
})
export const ForgetPasswordScreen = connect(
  null,
  mapDispatchToProps
)(ForgetPasswordScreenComponent)
