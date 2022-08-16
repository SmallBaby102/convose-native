import { TouchableOpacity } from "react-native"
import styled from "styled-components"

import { CenteredText, color } from "convose-styles"

export const ButtonWrapper = styled(TouchableOpacity)`
    border-radius: 50px
    text-align: center
    padding-vertical: 15px
    padding-horizontal: 30px
    background: ${color.blue}    
    overflow: hidden
    width: 60%
    
    position: absolute
    bottom: 25px
    left: 20%

    justify-content: center
    align-items: center
    flex-direction: row
`

export const Label = styled(CenteredText)`
  font-family: Popins-medium;
  font-size: 15px;
  text-align: center;
  color: ${color.white};
`
