import * as React from "react"

import { color } from "convose-styles"
import { Indicator } from "./Styled"

type GroupCallIndicatorrType = {
  readonly isOnline: boolean
}

export const GroupCallIndicator: React.FunctionComponent<GroupCallIndicatorrType> = ({
  children,
  isOnline,
}) => {
  const backgroundColor = isOnline ? color.green : color.gray

  return (
    <>
      {children}
      <Indicator>LIVE Group Call</Indicator>
    </>
  )
}
