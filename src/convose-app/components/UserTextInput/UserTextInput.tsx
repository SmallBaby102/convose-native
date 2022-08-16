/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react"
import { ThemeContext } from "styled-components"
import { color } from "convose-styles"
import { TextInputProps } from "react-native"
import { UserInput } from "./styled"

type UserTextInputProps = {
  readonly value: string
  readonly placeholder: string
  readonly secure?: boolean
  readonly onTextChange?: (text: string) => void
  readonly errorMessage?: string | undefined
  readonly ref?: React.RefObject<any>
  readonly getRef?: (ref: any) => void
} & TextInputProps
const userInputStyle = { width: 300, padding: 5 }

export const UserTextInput: React.FunctionComponent<UserTextInputProps> = ({
  onTextChange,
  value,
  placeholder,
  secure,
  errorMessage,
  getRef,
  ...otherProps
}) => {
  const theme: any = React.useContext(ThemeContext)
  return (
    <UserInput
      containerStyle={userInputStyle}
      onChangeText={onTextChange}
      baseColor={theme.interests.input.placeholder}
      value={value}
      label={placeholder}
      secureTextEntry={secure}
      lineWidth={1}
      error={errorMessage}
      errorColor={color.red}
      ref={(ref: any) => getRef && getRef(ref)}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...otherProps}
    />
  )
}
