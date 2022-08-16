/* eslint-disable import/no-extraneous-dependencies */
import * as React from "react"
import { KeyboardAvoidingView, View } from "react-native"
import { color } from "convose-styles"
import { connect } from "react-redux"
import { AuthFormState } from "convose-app/components/AuthForm/types"
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

const ResetPasswordComponent: React.FunctionComponent<
  AuthScreenPurePops &
    ForgetPasswordProps &
    AuthFormState &
    NavigationInjectedProps &
    DispatchToProps
> = ({ navigation, password }) => {
  const [submited, setSubmitted] = useState(false)
  const handleFormSubmit = () => {
    requestAnimationFrame(() => {
      setSubmitted(true)
    })
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
      <KeyboardAvoidingView behavior="padding">
        {submited === false ? (
          <View>
            <Title>Set new password</Title>
            <FormWrapper>
              <UserTextInput
                autoCapitalize="none"
                placeholder="password"
                secure
                value={password}
                autoCompleteType="password"
                blurOnSubmit
                enablesReturnKeyAutomatically
                returnKeyLabel="done"
                returnKeyType="done"
                selectTextOnFocus
              />
              <SubmitButton label="Continue" onPress={handleFormSubmit} />
            </FormWrapper>
          </View>
        ) : (
          <View>
            Congratulations! You’ve successfully changed your password.
          </View>
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
export const ResetPasswordScreen = connect(
  null,
  mapDispatchToProps
)(ResetPasswordComponent)
