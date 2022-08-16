import { CenteredText, color } from "convose-styles"
import styled from "styled-components"

export const Indicator = styled(CenteredText)`
  font-size: 14px
  color: white
  border-radius: 20px
  bottom: -10px
  position: absolute
  left: 40
  padding: 2px
  width: 120
  text-align: center
  border-width: 3px
  border-color: ${(props: { theme: { main: { chatBox: string } } }) =>
    props.theme.main.chatBox}
  background: ${color.green}
`
