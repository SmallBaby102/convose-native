import React from "react"
import { withTheme } from "styled-components"

import { Header, HeaderProps } from "../../components/Header"

type HeaderPropsWithTheme = {
  theme: any
}
const HeaderComponent: React.FunctionComponent<HeaderPropsWithTheme> = (
  props
) => {
  const { theme, ...otherProps } = props
  const isDark = theme.mode === "dark"
  const backgroundColor = isDark
    ? "rgba(45, 45, 45, 1)"
    : "rgba(243, 243, 243, 1)"
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Header {...otherProps} backgroundColor={backgroundColor} />
}
// HeaderComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "HeaderComponent",
//   diffNameColor: "red",
// }
type InterestHeaderProps = Omit<
  HeaderProps,
  | "startCall"
  | "rejoinCall"
  | "canRejoinCall"
  | "theme"
  | "isInCallingChat"
  | "chatChannel"
>
export const InterestHeader: React.FunctionComponent<InterestHeaderProps> = React.memo(
  withTheme(HeaderComponent)
)
