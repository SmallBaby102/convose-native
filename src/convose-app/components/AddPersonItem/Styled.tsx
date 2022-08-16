import { TouchableOpacity, View } from "react-native"
import styled from "styled-components"

import { CenteredText, color, Props } from "convose-styles"

export const getIconColor = (count: number, notification: boolean): string => {
  if (notification) {
    return color.white
  }

  return count > 0 ? color.black : color.darkGray
}

export const ListPersonContainer = styled(View)`
  align-self: center
  width: 100%  
  margin-bottom: 25px
`

export const AddPersonContainer = styled(View)`
  align-self: center
  width: 90%
  padding: 15px
  background: ${(props: Props) => props.theme.main.chatBox} 
  border-radius: 25px  
  margin: 8px 0
`

export const TouchableWrapper = styled(TouchableOpacity)`
  flex-direction: row
  justify-content: center
  align-items: center
`

export const AvatarContainer = styled(View)`
  margin-right: 20;
`

export const Body = styled(View)`
  flex: 1
  flex-direction: column
`

export const Section = styled(View)`
  flex-direction: row
  justify-content: space-between
  align-items: center
  flex: 1
`

export const Username = styled(CenteredText)`
  color: ${(props: Props) => (props.color ? props.color : color.white)}
  font-family: Popins-bold;
  font-size: 18px;
`

export const BadgeView = styled(View)`
  justify-content: center
  align-items: center
`
