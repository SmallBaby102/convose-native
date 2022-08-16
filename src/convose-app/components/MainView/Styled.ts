import { View } from "react-native"
import styled from "styled-components"

import { CenteredText, color } from "convose-styles"
import { RootStack } from "../../router"

export const StyledRootStack = styled(RootStack)`
  flex: 1;
`

export const MainViewWrapper = styled(View)`
  background: ${color.main.background};
  flex: 1;
  height: 100%;
  width: 100%;
`

export const EndCallModal = styled(View)`
  position: absolute;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
  background: ${color.black_transparent_light};
  elevation: 12;
`
export const ModalContent = styled(CenteredText)`
  color: ${color.white};
  font-family: Popins-bold;
  font-size: 22px;
`
