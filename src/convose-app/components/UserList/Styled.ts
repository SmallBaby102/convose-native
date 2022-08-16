import { View, FlatList, TextInput } from "react-native"
import styled from "styled-components"

import { color, Props } from "convose-styles"

export const InboxWrapper = styled(View)`
  background: ${(props: Props) => props.theme.main.background}
  flex: 1
`

export const ConversationsWrapper = styled(View)`
  flex: 1;
`

export const StyledFlatlist = styled(FlatList)`
  padding: 0px 25px;
`

export const StyledSearchUserInput = styled(TextInput)`
  align-self: center
  margin: 15px 0px
  height: 45
  width: 85%
  border-radius: 40
  font-size: 18
  padding: 5px 20px
  background: ${(props: Props) =>
    props.theme.interests.autocompleteList.borderBottom}
  color:  ${color.interests.autocompleteList.color}
  include-font-padding: false
  text-align-vertical: center
`
