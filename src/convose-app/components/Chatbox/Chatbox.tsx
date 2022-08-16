/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import _ from "lodash"
import {
  ChatUser,
  createChatChannelId,
  ParticipantsListObject,
  UserStatus,
} from "convose-lib/chat"
import { InterestLocation, UserInterest } from "convose-lib/interests"
import { Routes } from "convose-lib/router"
import { Uuid } from "convose-lib/user"
import { AVATAR_SIZE, color, softShadows } from "convose-styles"
import {
  Avatar,
  InterestButton,
  PresenceIndicator,
  renderGroupAvatar,
} from "../../components"
import * as RootNavigation from "../../RootNavigation"
import {
  CallButtonWrapper,
  CallProfileRow,
  CallProfileWrapper,
  ChatboxAvatar,
  ChatboxContent,
  ChatboxHeader,
  ChatboxHeaderText,
  ChatboxMainContent,
  ChatboxSubheaderText,
  ChatboxVisible,
  ChatboxWrapper,
  HeaderTextWrapper,
  InCallUsersNumbertext,
  JoinCallText,
} from "./Styled"
import MainScreenCallIcon from "../../../assets/Icons/components/MainScreenCallIcon"

type ChatboxProps = {
  readonly getHistory?: any
  readonly user: ChatUser & { agora?: string } & {
    participants?: ParticipantsListObject
    group_name?: string
  }
  readonly myUuid: Uuid
  readonly userIsOnline?: boolean
  readonly subscribeChat?: any
  readonly fullHeight?: boolean
  readonly fullWidth?: boolean
  readonly style?: any
  readonly callingChannel: string
  readonly darkMode: boolean | null
}
const interestStyle = {
  marginLeft: 0,
  marginTop: 0,
  marginRight: 10,
  marginBottom: 10,
}
export class ChatboxComponent extends React.Component<ChatboxProps> {
  public shouldComponentUpdate(prevProps: ChatboxProps): boolean {
    return !_.isEqual(this.props, prevProps)
  }

  private readonly startConversation = (
    forRejoinCallParam: boolean | undefined
  ): void => {
    const { myUuid, user, callingChannel } = this.props
    const { uuid, agora } = user
    const channel = agora ? uuid : createChatChannelId(myUuid, uuid)
    let forRejoinCall
    if (
      typeof forRejoinCallParam === "boolean" ||
      typeof forRejoinCallParam === "undefined"
    ) {
      forRejoinCall =
        forRejoinCallParam && (!callingChannel || callingChannel !== channel)
    } else {
      forRejoinCall = false
    }

    RootNavigation.navigate(Routes.ChatDrawer, {
      screen: Routes.Chat,
      params: {
        channel,
        chatUser: user,
        forRejoinCall,
      },
    })
  }

  public mappedInterests = (
    interests: readonly UserInterest[]
  ): React.ReactNode =>
    interests.map((interest: UserInterest) => (
      <InterestButton
        disabled
        interest={interest}
        key={interest.name}
        interestLocation={InterestLocation.Chatbox}
        wrapperStyle={interestStyle}
      />
    ))

  renderJoinCallButton = (): React.ReactNode => {
    const {
      user: { agora },
    } = this.props
    if (!agora) {
      return null
    }
    const parsedAgora = JSON.parse(agora.toString())
    const inCallUsers = [...parsedAgora.broadcasters, ...parsedAgora.audience] // Todo: add audiences when backend is ready
    return (
      <CallButtonWrapper onPress={() => this.startConversation(true)}>
        <MainScreenCallIcon width="34" height="34" />
        <JoinCallText>Join Call</JoinCallText>
        <CallProfileRow>
          {inCallUsers.slice(0, 4).map((u, index) => (
            // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
            <CallProfileWrapper style={{ left: -12 * index }}>
              <Avatar userAvatar={u.avatar} height={35} width={35} />
            </CallProfileWrapper>
          ))}

          {inCallUsers.length > 4 && (
            <InCallUsersNumbertext
              // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
              style={{ left: -30 }}
            >
              +{inCallUsers.length - 4}
            </InCallUsersNumbertext>
          )}
        </CallProfileRow>
      </CallButtonWrapper>
    )
  }

  public render(): React.ReactNode {
    const { user, fullWidth, fullHeight, style, darkMode } = this.props
    const {
      avatar,
      interests,
      status,
      theme_color,
      username,
      agora,
      participants,
      group_name,
    } = user
    let isGroupCallChat
    if (agora !== undefined) {
      isGroupCallChat = true
      if (agora === "") return null
    }

    return (
      <ChatboxWrapper
        fullWidth={fullWidth}
        // eslint-disable-next-line react-perf/jsx-no-new-array-as-prop
        style={[softShadows, style]}
        onPress={this.startConversation}
        darkMode={darkMode}
        isGroupCallChat={isGroupCallChat}
      >
        <ChatboxVisible
          isGroupCallChat={isGroupCallChat}
          fullHeight={fullHeight}
        >
          <ChatboxMainContent>
            <ChatboxHeader themeColor={theme_color}>
              <ChatboxAvatar>
                <PresenceIndicator
                  isOnline={status === UserStatus.Online}
                  isGroupCallChat={isGroupCallChat}
                >
                  {isGroupCallChat ? (
                    renderGroupAvatar(
                      participants ? Object.values(participants) : undefined,
                      AVATAR_SIZE
                    )
                  ) : (
                    <Avatar userAvatar={avatar} />
                  )}
                </PresenceIndicator>
              </ChatboxAvatar>
              <HeaderTextWrapper>
                <ChatboxHeaderText
                  ellipsizeMode="tail"
                  themeColor={theme_color}
                  isGroupCallChat={isGroupCallChat}
                  darkMode={darkMode}
                >
                  {isGroupCallChat ? group_name : username}
                </ChatboxHeaderText>
                {isGroupCallChat && (
                  <ChatboxSubheaderText
                    ellipsizeMode="tail"
                    themeColor={color.green}
                  >
                    Live group call
                  </ChatboxSubheaderText>
                )}
              </HeaderTextWrapper>
            </ChatboxHeader>
            <ChatboxContent>
              {this.mappedInterests(interests.slice(0, 6))}
            </ChatboxContent>
          </ChatboxMainContent>
          {isGroupCallChat && this.renderJoinCallButton()}
        </ChatboxVisible>
      </ChatboxWrapper>
    )
  }
}
// ChatboxComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "ChatboxComponent",
//   diffNameColor: "red",
// }
export const Chatbox = ChatboxComponent
