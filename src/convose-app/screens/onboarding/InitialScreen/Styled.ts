import { View , Image} from "react-native"
import styled from "styled-components"
import { Props } from "convose-styles"
import { PrimaryButton } from "../../../components/PrimaryButton"

const space = 50

export const Container = styled(View)`
    flex: 1
    align-items: center
    justify-content: center
    flex-direction: column
    padding: 15px
    background-color: ${(props: Props) => props.theme.main.background}
`
export const ConvoseLogo = styled(Image)`
  width: 100
  height: 110
`

export const TryOutButton = styled(PrimaryButton)`
  margin-vertical: ${space}px;
  min-width: 200px;
`
export const LoginButton = styled(PrimaryButton)``
