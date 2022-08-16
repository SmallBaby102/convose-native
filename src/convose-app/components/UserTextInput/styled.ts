import { TextField } from "rn-material-ui-textfield"
import styled from "styled-components"

import { color, Props, softShadows } from "convose-styles"

export const labelTextStyle = { textTransform: "uppercase", fontWeight: "bold" }

export const containerStyle = {
  backgroundColor: color.white,
  height: 60,
  width: 300,
  ...softShadows,
}

export const UserInput = styled(TextField)`
  color: ${(props: Props) => props.theme.textInput.color};
`
