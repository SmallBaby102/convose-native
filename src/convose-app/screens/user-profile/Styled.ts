import { AVATAR_SIZE } from "convose-styles"
import { View } from "react-native"
import styled from "styled-components"

export const UserListWrapper = styled(View)`
  flex: 1;
`

export const ScrollViewWrapper = styled(View)`
  padding: 80px 20px 10px 20px;
`

export const CloseButtonWrapper = styled(View)`
  align-items: center;
  margin-bottom: 40px;
`
export const CloseButtonIconWrapper = styled(View)`
  align-items: center;
  height: ${AVATAR_SIZE}px;
  width: ${AVATAR_SIZE}px;
  border-radius: 30px;
`
