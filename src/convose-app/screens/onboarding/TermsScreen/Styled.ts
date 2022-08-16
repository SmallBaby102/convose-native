import { Props } from "convose-styles"
import { TouchableOpacity, View } from "react-native"
import styled from "styled-components"

export const TermsWrapper = styled(TouchableOpacity)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.35);
`
export const TermsWrapperView = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.75);
`
export const TermsScreenWrapper = styled(View)`
  width: 100%;
  height: 100%;
  background: ${(props: Props) => props.theme.main.background};
`
