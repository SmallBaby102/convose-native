import { View } from "react-native"
import styled from "styled-components"
import { CenteredText, Props } from "convose-styles"
import { MaterialIndicator } from "react-native-indicators"
import { PrimaryButton } from "../PrimaryButton"

export const FormWrapper = styled(View)`
    width: 100%
    justify-content: center
    align-items: center
    marginVertical: 30px
`

export const ForgotPasswordText = styled(CenteredText)`
    font-family: Popins-extra-bold;
    font-size: 11px;
    text-align: center;
    text-transform: uppercase
    color: ${(props: Props) => props.theme.mainBlue};
    margin-top: 20px
`

export const SubmitButton = styled(PrimaryButton)`
  margin-top: 20px;
`

export const LoadingSpinner = styled(MaterialIndicator)`
  margin-top: 20px;
`
