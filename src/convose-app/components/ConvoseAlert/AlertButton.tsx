import React from "react"

import { Button, ButtonLabel } from "./Styled"

export type ButtonType = {
  title: string
  onPress?: () => void
  type?: "default" | "cancel" | undefined
}
type Props = ButtonType & { isLast?: boolean }
export const AlertButton: React.FunctionComponent<Props> = ({
  title,
  onPress,
  type,
  isLast,
}) => {
  return (
    <Button onPress={onPress} isCancel={type === "cancel"} isLast={isLast}>
      <ButtonLabel isCancel={type === "cancel"}>{title}</ButtonLabel>
    </Button>
  )
}
