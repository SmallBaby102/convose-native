import { Ionicons } from "@expo/vector-icons"
import { TouchableHighlight, TouchableOpacity, View } from "react-native"
import styled from "styled-components"
import { CenteredText, color, Props, width } from "convose-styles"
import { MentionInput } from "../../../../self-maintained-packages/react-native-controlled-mentions/src"

const ICONS_SIZE = 30
const MARGIN_BETWEEN_ELEMENTS = 10

type InsetTypes = {
  insetBottom?: number
  showEmoticons?: boolean
  isInCallingChat?: boolean
}

export const ChatInputBar = styled(View)`
  align-content: center;
  background: ${color.transparent};
  bottom: 0;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  position: relative;
  width: 100%;
  padding: 0px 0px 0px 5px;
  padding-bottom: ${(props: InsetTypes) => {
    const paddingBottomRaw = props.insetBottom || 0
    const paddingBottom = props.isInCallingChat
      ? paddingBottomRaw + 7
      : paddingBottomRaw
    if (props.showEmoticons) {
      return paddingBottom + 10
    }
    return paddingBottom
  }}px;
`

export const StyledInput = styled(MentionInput)`
  flex: 1;
  font-size: 17px;
  padding: 5px 15px;
  max-width: ${width};
  max-height: 150px;
  font-family: Popins;
  include-font-padding: false;
  include-font-padding: false;
  text-align-vertical: center;
  color: ${(props: Props) => props.theme.textInput.color};
`

export const IconButtonWrapper = styled(View)`
  justify-content: flex-end;
  align-items: center;
`

export const IconWrapper = styled(TouchableHighlight)`
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50px;
`

export const MarginRight = styled(View)`
  margin-right: ${MARGIN_BETWEEN_ELEMENTS}px;
`

export const Icon = styled(Ionicons)`
  color: ${(props: Props) =>
    props.color ? props.color : props.theme.mainBlue};
  font-size: ${ICONS_SIZE};
`

export const TimerText = styled(CenteredText)`
  min-width: 24px;
  font-size: 24px;
  color: ${(props: Props) => props.theme.main.text};
  font-family: Popins-light;
`

export const ExtraTimerText = styled(CenteredText)`
  min-width: 15px;
  padding-top: 4px;
  font-size: 15px;
  color: ${(props: Props) => props.theme.main.text};
  font-family: Popins-light;
`

export const AudioFormWrapper = styled(View)`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: ${(props: InsetTypes) =>
    props.insetBottom ? props.insetBottom + 90 : 90}px;
  background-color: ${(props: Props) => props.theme.main.chatBox};
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  flex-wrap: nowrap;
  flex: 1;
  z-index: 100;
  padding-bottom: ${(props: InsetTypes) => props.insetBottom || 0}px;
`

export const CircleButton = styled(TouchableOpacity)`
  border-radius: 50;
  height: 40px;
  width: 40px;
  padding: 5px;
  justify-content: center;
  align-items: center;
  text-align-vertical: bottom;
`
export const SquareButton = styled(TouchableOpacity)`
  border-radius: 50;
  min-width: 100;
  min-height: 60;
  padding-vertical: 15px;
  padding-horizontal: 35px;
  justify-content: center;
  align-items: center;
  text-align-vertical: bottom;
`

export const RecordingIndicatorWrapper = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 0 5px;
  width: 70px;
`

export const SearcherWrapper = styled(View)`
  background: ${(props: Props) => props.theme.main.chatBox};
  margin-top: 5;
  max-height: 200px;
  border-radius: 15px;
  bottom: 5px;
  padding: 5px;
`
export const SearchRow = styled(View)`
  flex-direction: row;
  margin: 10px;
`
export const SearchIcon = styled(View)`
  width: 30px;
`
export const SearchWord = styled(View)`
  align-items: center;
  justify-content: center;
  margin-left: 10px;
`

export const SearchText = styled(CenteredText)`
  color: ${(props: Props) =>
    props.color ? props.color : props.theme.main.text};
  font-size: 18px;
  font-family: Popins-bold;
`
