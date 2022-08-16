import * as React from "react"

import { ModalContent, ModalOverlay } from "./Styled"

type ModalWrapperProps = {
  readonly onPress?: () => void
}

export const ModalWrapper: React.SFC<ModalWrapperProps> = ({
  children,
  onPress,
}) => (
  <ModalContent>
    <ModalOverlay onPress={onPress} />
    {children}
  </ModalContent>
)
