import React from "react"
import {
  BasketballSvg,
  LocationSvg,
  MusicNoteSvg,
  LanguageSvg,
} from "../../../assets/svg"

import { IconContainer, NoInterestsImageContainer } from "./styled"

const iconHeight = 40
const icons = [
  <BasketballSvg height={iconHeight} />,
  <LocationSvg height={iconHeight} />,
  <MusicNoteSvg height={iconHeight} />,
  <LanguageSvg height={iconHeight} />,
]
export const NoInterests: React.FunctionComponent = () => {
  return (
    <NoInterestsImageContainer>
      {icons.map((icon, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <IconContainer key={index} stepUp={index % 2}>
          {icon}
        </IconContainer>
      ))}
    </NoInterestsImageContainer>
  )
}
