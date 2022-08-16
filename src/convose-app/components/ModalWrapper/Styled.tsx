import { color } from "convose-styles"
import { TouchableOpacity, View } from "react-native"
import styled from "styled-components"

export const ModalOverlay = styled(TouchableOpacity)`
  bottom: 0;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
`

export const ModalContent = styled(View)`
  align-items: center;
  height: 100%;
  justify-content: center;
  z-index: 101;
  background: ${color.gray_transpatent_light};
`

export const TouchableWithoutFeedbackArea = styled(View)`
  bottom: 0;
  flex: 1;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  z-index: 100;
`
