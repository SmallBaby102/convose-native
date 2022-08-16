import { Ionicons } from "@expo/vector-icons"
import { State } from "convose-lib"
import { ChatSummary, ChatUser } from "convose-lib/chat"
import {
  selectChatSummary,
  selectParticipantsArray,
} from "convose-lib/users-list"
import { color } from "convose-styles"
import React from "react"
import { View } from "react-native"
import { connect } from "react-redux"
import { Avatar } from ".."
import { ButtonWrapper, Label, TextWrapper } from "./styled"

const callIconStyle = { transform: [{ translateX: -7 }] }
type JoinCallBarProps = {
  rejoinCall: () => void
  // eslint-disable-next-line react/require-default-props
  // eslint-disable-next-line react/no-unused-prop-types
  chatChannel: string | undefined
}

type StateToProps = {
  chatSummary: ChatSummary | null | undefined
  participants: ChatUser[]
  me: ChatUser
}

const JoinCallBarComponent = ({
  rejoinCall,
  chatSummary,
  participants,
  me,
}: JoinCallBarProps & StateToProps): React.ReactElement => {
  const audienceArray =
    chatSummary && chatSummary.agora
      ? JSON.parse(chatSummary.agora.toString()).audience
      : []
  const broadcastersArray =
    chatSummary && chatSummary.agora
      ? JSON.parse(chatSummary.agora.toString()).broadcasters
      : []
  const inCallUsersArray = [...broadcastersArray, ...audienceArray]
  const inCallUsersNumber = inCallUsersArray.length
  const participantsWithMe = [...participants, me]
  const firstThreeIncallUsers = inCallUsersArray.slice(0, 3)

  return (
    <ButtonWrapper onPress={rejoinCall}>
      <Ionicons
        name="ios-call"
        size={14}
        color={color.white}
        style={callIconStyle}
      />
      {firstThreeIncallUsers.length > 0 &&
        firstThreeIncallUsers.map((user, index) => (
          <View
            // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
            style={{ transform: [{ translateX: -7 * index }] }}
            key={user?.uuid || index}
          >
            <Avatar
              height={18}
              width={18}
              userAvatar={user ? user.avatar : undefined}
            />
          </View>
        ))}
      <TextWrapper>
        <Label>+{inCallUsersNumber}</Label>
      </TextWrapper>
      <TextWrapper>
        <Label italic>{"   Tap to join"}</Label>
      </TextWrapper>
    </ButtonWrapper>
  )
}
const mapStateToProps = (
  state: State,
  ownProps: JoinCallBarProps
): StateToProps => ({
  chatSummary: selectChatSummary(ownProps.chatChannel || "")(state),
  participants: selectParticipantsArray(ownProps.chatChannel || "")(state),
  me: state.user,
})
export default connect(mapStateToProps)(JoinCallBarComponent)
