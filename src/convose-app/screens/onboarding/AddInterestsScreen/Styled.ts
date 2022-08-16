import { ScrollView, StyleSheet, View } from "react-native"
import styled from "styled-components"

import { CenteredText, color, font, Props } from "convose-styles"
import { SearchInterests } from "../../../components/SearchInterests"

const spacing = 30

export const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
})

export const StyledScrollView = styled(ScrollView)`
  background: ${(props: Props) => props.theme.main.background}
  flex: 1;
`

export const StyledView = styled(View)`
    flex: 1;
    align-items: center
    justify-content: center
`

export const Container = styled(View)`
    width: 95%
    flex: 1
    align-items: center
    justify-content: center
    flex-direction: column
`
export const WidthWrapper = styled(View)`
  width: 85%;
`

export const Title = styled(CenteredText)`
    font-family: ${font.extraBold}
    font-weight: 600
    font-size: 33px
    text-align: center
    color: ${(props: Props) => props.theme.main.text};
    include-font-padding: false
    text-align-vertical: center
`

export const StyledText = styled(CenteredText)`
    font-family: ${font.normal}
    font-size: 20px
    text-align: center
    color: ${color.darkGray}
    include-font-padding: false
    text-align-vertical: center
    margin-vertical: ${spacing}px
`

export const AddInterestButton = styled(SearchInterests)`
    min-width: 200px
    padding: 18px
    margin-bottom: ${spacing}px
`
