/* eslint-disable react-perf/jsx-no-new-object-as-prop */
import React from "react"
import {
  BasketballSvg,
  LanguageSvg,
  LocationSvg,
  MusicNoteSvg,
} from "../../../assets/svg"
import { ExplainerIconContainer, ExplainerIconsWrapper } from "./Styled"

const ICON_SIZE = 30
export const ExplainerIcons: React.FunctionComponent = () => {
  return (
    <ExplainerIconsWrapper>
      <ExplainerIconContainer>
        <BasketballSvg height={ICON_SIZE} />
      </ExplainerIconContainer>
      <ExplainerIconContainer style={{ marginBottom: 60 }}>
        <LocationSvg height={ICON_SIZE} />
      </ExplainerIconContainer>
      <ExplainerIconContainer style={{ marginBottom: 30 }}>
        <MusicNoteSvg height={ICON_SIZE} />
      </ExplainerIconContainer>
      <ExplainerIconContainer>
        <LanguageSvg height={ICON_SIZE} color="rgba(242, 245, 75, 1)" />
      </ExplainerIconContainer>
    </ExplainerIconsWrapper>
  )
}
