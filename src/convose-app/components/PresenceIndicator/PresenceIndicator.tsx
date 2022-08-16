import * as React from "react"

import { color } from "convose-styles"
import { Indicator } from "./Styled"

type PresenceIndicatorType = {
  readonly children?: React.ReactNode
  readonly isOnline?: boolean
  readonly isGroupCallChat?: boolean
}

export const PresenceIndicator: React.FunctionComponent<PresenceIndicatorType> = ({
  children,
  isOnline,
  isGroupCallChat = false,
}) => {
  const backgroundColor = isOnline ? color.green : color.gray

  return (
    <>
      {children}
      {!isGroupCallChat && <Indicator backgroundColor={backgroundColor} />}
    </>
  )
}
