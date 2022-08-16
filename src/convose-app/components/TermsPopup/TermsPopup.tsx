import React from "react"

import {
  AlertCard,
  ConfirmButton,
  Container,
  TermsLink,
  TermsText,
  Title,
} from "./Styled"

type TermsPopupProps = {
  readonly onPress: () => void
  readonly onPressTerm: () => void
}

export const TermsPopup: React.FunctionComponent<TermsPopupProps> = ({
  onPress,
  onPressTerm,
}) => {
  return (
    <AlertCard touchSoundDisabled>
      <Container pointerEvents="box-none">
        <Title>Review the terms</Title>
        <TermsText>
          Do you understand and agree to Convose’s
          <TermsLink onPress={onPressTerm}>
            {" "}
            terms and conditions of use?
          </TermsLink>
        </TermsText>
        <ConfirmButton onPress={onPress} label="I agree" />
      </Container>
    </AlertCard>
  )
}
