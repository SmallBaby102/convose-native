import * as React from "react"
import { View } from "react-native"

import { TextWrapper, Label, CallStatusIcon } from "./Styled"

type CallStatusMessageProps = {
  readonly message: Array<string>
  readonly withBgColor?: boolean
}

export const CallStatusMessage: React.FunctionComponent<CallStatusMessageProps> = ({
  message,
  withBgColor,
}) => (
  <View>
    <TextWrapper withBgColor={withBgColor}>
      <CallStatusIcon name={message[1]} size={11} />
      <Label>{message[0]}</Label>
    </TextWrapper>
  </View>
)
