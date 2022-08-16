import { ScrollView, StyleSheet, View } from "react-native"
import styled from "styled-components"
import { CenteredText, color, font, Props } from "convose-styles"
import { PrimaryButton } from "../../../components/PrimaryButton"

const spacing = 20

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: color.white,
  },
})

export const StyledScrollView = styled(ScrollView)`
  flex-grow: 1;
  background: ${(props: Props) => props.theme.main.background};
`

export const StyledView = styled(View)`
    flex: 1;
    align-items: center
    justify-content: flex-start
`
export const Container = styled(View)`
    width: 90%;
    align-items: center
    justify-content: flex-start
    flex-direction: column
    marginVertical: ${spacing}px;
`

export const Title = styled(CenteredText)`
    font-family: ${font.extraBold}
    font-size: ${(props: Props) => (props.fontSize ? props.fontSize : "22px")}
    color:${color.black}
    text-align: left
    margin-bottom: ${spacing - 10}px
    width: 90%
`

export const TermsText = styled(CenteredText)`
    font-size: 14px
    color: ${color.darkGray}
    text-align: left
    align-self: center
    font-family: ${font.normal}
    margin-bottom: ${spacing - 10}px
    width: 90%
    `
export const TermslistText = styled(CenteredText)`
    font-size: 14px
    color: ${color.darkGray}
    text-align: left
    align-self: flex-end
    font-family: ${font.normal}
    margin-bottom: ${spacing - 10}px
    width: 90%
    `

export const ConfirmButton = styled(PrimaryButton)`
  width: 100%;
`
