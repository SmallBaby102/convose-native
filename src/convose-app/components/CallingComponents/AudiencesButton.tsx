/* eslint-disable complexity */
/* eslint-disable react-perf/jsx-no-new-array-as-prop */
import React, { Component } from "react"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import _ from "lodash"
import {
  AgoraUuid,
  AudioSetting,
  Peer,
  SetPeersAction,
} from "convose-lib/calling"
import { ChatSummary, ChatUser } from "convose-lib/chat"
import { color, defaultShadows } from "convose-styles"
import { OrderedMap } from "immutable"
import { Platform, ScrollView } from "react-native"
import { MuteIcon } from "."
import { Avatar } from "../Avatar"
import {
  CallingIndicationWrapper,
  AudiencesButtonWrapper,
  TextWrapper,
} from "./Styled"

type AudiencesButtonProps = {
  readonly isHost: boolean
  readonly peers: OrderedMap<AgoraUuid, Peer>
  readonly chatSummary: ChatSummary | null | undefined
  readonly participants: ChatUser[]
  readonly me: ChatUser
  readonly audioSetting: AudioSetting
  readonly setPeers: (setPeers: {
    readonly action: string
    readonly peer: Peer
  }) => void
  readonly channel: string
}

type AudiencesButtonState = {
  readonly total: number
  readonly newJoinedUsers: number[]
  readonly mutedBubbleArray: number[]
  readonly checkAudienceOfflineArray: Peer[]
}
const contentContainerStyle = [
  {
    paddingVertical: 10,
    paddingRight: 10,
  },
  Platform.OS === "ios" && defaultShadows,
]
const AudiencesButtonListStyle = { transform: [{ rotateY: "180deg" }] }

class AudiencesButtonComponent extends Component<
  AudiencesButtonProps,
  AudiencesButtonState
> {
  state: AudiencesButtonState = {
    total: 0,
    newJoinedUsers: [],
    mutedBubbleArray: [],
    checkAudienceOfflineArray: [],
  }

  private audienceArray: number[] = []

  private broadcastersArray: number[] = []

  private activePeersArray: Peer[] = []

  private mutedAudiencesArray: Peer[] = []

  componentDidMount(): void {
    setInterval(() => {
      const { me, setPeers } = this.props
      const { checkAudienceOfflineArray } = this.state
      checkAudienceOfflineArray.length > 0 &&
        checkAudienceOfflineArray.forEach((toBeCheckedAudience) => {
          if (
            toBeCheckedAudience.agoraUuid !== me.id &&
            !this.audienceArray.includes(toBeCheckedAudience.agoraUuid) &&
            !this.broadcastersArray.includes(toBeCheckedAudience.agoraUuid) &&
            this.activePeersArray.findIndex(
              (activePeer) =>
                activePeer.agoraUuid === toBeCheckedAudience.agoraUuid
            ) === -1
          ) {
            setPeers({
              action: SetPeersAction.SetPeerOffline,
              peer: {
                agoraUuid: toBeCheckedAudience.agoraUuid,
                isAudience: false,
              },
            })
          }
        })
    }, 15000)
  }

  public shouldComponentUpdate(
    prevProps: AudiencesButtonProps,
    prevState: AudiencesButtonState
  ): boolean {
    return (
      !_.isEqual(this.props, prevProps) || !_.isEqual(this.state, prevState)
    )
  }

  componentDidUpdate(prevProps: AudiencesButtonProps): void {
    const { chatSummary, me, isHost, audioSetting, peers } = this.props

    this.audienceArray =
      chatSummary && chatSummary.agora
        ? JSON.parse(chatSummary.agora.toString()).audience
        : []
    this.broadcastersArray =
      chatSummary && chatSummary.agora
        ? JSON.parse(chatSummary.agora.toString()).broadcasters
        : []
    const peersArray = [...peers.values()]
    peersArray.push({
      agoraUuid: me.id,
      isActive: isHost,
      isAudience: !isHost,
      muteStateChangeTime: audioSetting.muteStateChangeTime,
    })

    this.activePeersArray = peersArray.filter((peer) => peer.isActive)
    this.mutedAudiencesArray = peersArray.filter(
      (peer) => (peer.isMuted && !peer.isVideoEnabled) || peer.isAudience
    )

    if (
      (prevProps.chatSummary &&
        prevProps.chatSummary.agora &&
        chatSummary &&
        chatSummary.agora &&
        prevProps.chatSummary.agora.toString() !==
          chatSummary.agora.toString()) ||
      prevProps.isHost !== isHost ||
      JSON.stringify(peers) !== JSON.stringify(prevProps.peers)
    ) {
      const orderedMutedAudiencesArray = this.mutedAudiencesArray
        .sort((prev, next) =>
          !!prev.muteStateChangeTime && !!next.muteStateChangeTime
            ? prev.muteStateChangeTime - next.muteStateChangeTime
            : 1
        )
        .map((audience) => audience.agoraUuid)

      this.audienceArray.forEach((uid: number) => {
        peersArray.findIndex((peer) => peer.agoraUuid === uid) === -1 &&
          orderedMutedAudiencesArray.push(uid)
      })
      const mutedBubbleArray = orderedMutedAudiencesArray.filter(
        (id) => typeof id === "number"
      )
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        mutedBubbleArray,
        total: this.activePeersArray.length + mutedBubbleArray.length,
        checkAudienceOfflineArray: this.mutedAudiencesArray,
      })
    }
  }

  render(): React.ReactNode {
    const { participants, me } = this.props
    const { mutedBubbleArray, newJoinedUsers, total } = this.state
    const participantsArray = [...participants]
    participantsArray.push(me) // all users in the group(in call or not!)

    return (
      <AudiencesButtonWrapper>
        {mutedBubbleArray.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={contentContainerStyle}
            style={AudiencesButtonListStyle}
          >
            {mutedBubbleArray.map((peer, index) => {
              const profileIndex = participantsArray.findIndex(
                (p) => p.id === peer
              )

              // user is not in the call or not muted
              if (profileIndex === -1) {
                // If there's new users joined in with no profile info, store it in state
                if (!newJoinedUsers.includes(peer)) {
                  this.setState({ newJoinedUsers: [...newJoinedUsers, peer] })
                }
                return null
              }
              const CallingIndicationStyle = [
                Platform.OS === "android" && defaultShadows,
                {
                  transform: [
                    { translateX: -5 * index },
                    { rotateY: "180deg" },
                  ],
                },
              ]

              return (
                <CallingIndicationWrapper
                  style={CallingIndicationStyle}
                  key={peer}
                >
                  <Avatar
                    height={30}
                    width={30}
                    userAvatar={participantsArray[profileIndex].avatar}
                  />
                  {MuteIcon(16, true)}
                </CallingIndicationWrapper>
              )
            })}
          </ScrollView>
        )}
        <CallingIndicationWrapper style={defaultShadows} isTotalButton>
          <MaterialCommunityIcons
            name="eye-outline"
            size={24}
            color={color.mainBlue}
          />
          <TextWrapper color={color.mainBlue} background="white">
            {total}
          </TextWrapper>
        </CallingIndicationWrapper>
      </AudiencesButtonWrapper>
    )
  }
}
// AudiencesButtonComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "AudiencesButtonComponent",
//   diffNameColor: "red",
// }
export const AudiencesButton = AudiencesButtonComponent
