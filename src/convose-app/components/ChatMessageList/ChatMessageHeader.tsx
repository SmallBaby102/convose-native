/* eslint-disable camelcase */
import * as React from "react"
import { TouchableOpacity } from "react-native"
import { connect } from "react-redux"
import _ from "lodash"

import { ChatChannel, ChatUser, selectChatIsTyping } from "convose-lib/chat"
import { State } from "convose-lib/store"
import { Uuid } from "convose-lib/user"
import { selectIsCaller } from "convose-lib/calling"
import {
  AvatarContainer,
  ChatAvatar,
  GroupAvatarWrapper,
} from "../../components/ChatMessageList/Styled"
import GroupAllIcon from "../../../assets/Icons/components/GroupAllIcon"
import { Avatar, Header, PresenceIndicator } from "../../components"

const style = { marginRight: 15 }
export const renderGroupAvatar = (
  participants: Array<ChatUser> | undefined,
  AVATAR_SIZE = 30,
  iconFunction?: (forRejoinCall: boolean | undefined) => void
): React.ReactNode => {
  if (participants && participants.length > 1) {
    const AVATAR_SIZE_GroupItem = AVATAR_SIZE * 0.75
    return (
      <AvatarContainer size={AVATAR_SIZE} onPress={iconFunction}>
        <Avatar
          height={AVATAR_SIZE_GroupItem}
          width={AVATAR_SIZE_GroupItem}
          userAvatar={participants[participants.length - 1].avatar}
        />
        <GroupAvatarWrapper size={AVATAR_SIZE}>
          <Avatar
            height={AVATAR_SIZE_GroupItem}
            width={AVATAR_SIZE_GroupItem}
            userAvatar={participants[participants.length - 2].avatar}
          />
        </GroupAvatarWrapper>
      </AvatarContainer>
    )
  }
  return (
    <TouchableOpacity
      style={style}
      onPress={() => iconFunction && iconFunction(false)}
    >
      <GroupAllIcon width={`${AVATAR_SIZE}px`} height={`${AVATAR_SIZE}px`} />
    </TouchableOpacity>
  )
}

type ChatMessageHeaderProps = {
  readonly chatChannel: ChatChannel
  readonly chatUser: ChatUser
  readonly isCalling: boolean
  readonly participants: ChatUser[] | undefined
  readonly myUuid: Uuid
  readonly goBack: () => void
  readonly showProfile: () => void
  readonly userIsOnline: boolean
  readonly isGroup: boolean
  readonly startCall: () => void
  readonly canRejoinCall: boolean | null
  readonly rejoinCall: () => void
  readonly isInCallingChat: boolean
  readonly toggleSettingsMenu: () => void
  readonly groupName: string | undefined
}

type StateToProps = {
  readonly isCaller: boolean
  readonly isTyping: boolean
}
type ChatMessageHeaderType = StateToProps & ChatMessageHeaderProps

class ChatMessageHeaderComponent extends React.Component<ChatMessageHeaderType> {
  public shouldComponentUpdate(prevProps: ChatMessageHeaderType): boolean {
    return !_.isEqual(this.props, prevProps)
  }

  private readonly renderChatAvatar = (): React.ReactNode => {
    const { showProfile, userIsOnline, chatUser } = this.props
    return (
      <TouchableOpacity style={style} onPress={showProfile}>
        <PresenceIndicator isOnline={userIsOnline}>
          <ChatAvatar height={30} userAvatar={chatUser.avatar} width={30} />
        </PresenceIndicator>
      </TouchableOpacity>
    )
  }

  private readonly isTypingInfo = (): string => {
    const { isTyping } = this.props

    return isTyping ? "Typing..." : ""
  }

  public render(): React.ReactNode {
    const {
      toggleSettingsMenu,
      goBack,
      showProfile,
      chatUser: { theme_color, username },
      isGroup,
      startCall,
      rejoinCall,
      participants,
      canRejoinCall,
      // isCalling,
      isInCallingChat,
      chatChannel,
      groupName,
    } = this.props

    return (
      <Header
        avatar={
          isGroup
            ? renderGroupAvatar(participants, 30, showProfile)
            : this.renderChatAvatar()
        }
        onBackPress={goBack}
        onTitlePress={showProfile}
        subheader={this.isTypingInfo()}
        textColor={isGroup ? "SystemDefualt" : theme_color}
        title={isGroup ? groupName || "" : username}
        onMenuPress={toggleSettingsMenu}
        startCall={startCall}
        rejoinCall={rejoinCall}
        isInCallingChat={isInCallingChat}
        canRejoinCall={!!canRejoinCall}
        chatChannel={chatChannel}
        hasMenu
        sticky
      />
    )
  }
}
// ChatMessageHeaderComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "ChatMessageHeaderComponent",
//   diffNameColor: "red",
// }
const mapStateToProps = (
  state: State,
  ownProps: ChatMessageHeaderProps
): StateToProps => ({
  isCaller: selectIsCaller(state),
  isTyping: selectChatIsTyping(ownProps.chatChannel)(state) || false,
})

export default connect(mapStateToProps)(ChatMessageHeaderComponent)
