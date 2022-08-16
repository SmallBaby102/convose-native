import * as React from "react"
import { View } from "react-native"

import { Info, InfoBorder } from "./Styled"

type ChatInfoProps = {
  readonly text: string
  readonly withBorder?: boolean
  readonly withBgColor?: boolean
}

const ChatInfoComponent: React.FunctionComponent<ChatInfoProps> = ({
  text,
  withBorder,
  withBgColor,
}): React.ReactElement => (
  <View>
    {withBorder && <InfoBorder />}
    <Info withBgColor={withBgColor}>{text}</Info>
  </View>
)
export const ChatInfo = React.memo(ChatInfoComponent)
