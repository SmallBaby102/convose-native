/* eslint-disable no-nested-ternary */
import React, { useState, useEffect } from "react"
import { Platform, ActivityIndicator } from "react-native"
import _ from "lodash"
import {
  AgoraUuid,
  AudioSetting,
  CallSignal,
  JoinCall,
  Peer,
} from "convose-lib/calling"
import { User } from "convose-lib/user"

import { ChatUser, shortenChannelId } from "convose-lib/chat"

import { RtcLocalView, RtcRemoteView } from "react-native-agora"
import { color, defaultShadows } from "convose-styles"
import { OrderedMap } from "immutable"
import { FontAwesome, Ionicons } from "@expo/vector-icons"
import { DEFAULT_HIT_SLOP } from "convose-lib/utils"
import {
  CallingWrapper,
  ScreenWrapper,
  SquareAvatar,
  ProfileContainer,
  ProfileShadowWrapper,
  BackgroundProfle,
  UsernameWrapper,
  Profile,
  Username,
  OtherUserMuteCircleButton,
  styles,
  OtherUserMuteCircleButtonWrapper,
} from "./Styled"
import { OutgoingCallAnimation } from "./OutgoingCallAnimation"
import { MuteIcon } from "."

type CallingProfilesStateType = {
  readonly newJoinedUsers: number[]
}

type CallingProfilesProps = {
  readonly isInCallingChat: boolean
  readonly callingFullScreenMode: boolean
  readonly me: User
  readonly audioSetting: AudioSetting
  readonly peers: OrderedMap<AgoraUuid, Peer>
  readonly isCaller: boolean
  readonly chatUser: Array<ChatUser | User> | null
  readonly channel: string
  readonly isGroup: boolean
  readonly joinCall: JoinCall
  readonly activePeer: number
  readonly isHost: boolean
  readonly muteRemoteUser: (muteCommand: string) => void
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultAvatarImage = require("../../../assets/Icons/avatar.png")

const LocalVideo =
  Platform.OS === "android"
    ? RtcLocalView.TextureView
    : RtcLocalView.SurfaceView
const RemoteVideo =
  Platform.OS === "android"
    ? RtcRemoteView.TextureView
    : RtcRemoteView.SurfaceView

const muteIconSize = 14
const muteButtonBottomStyle = [
  {
    position: "absolute",
    alignSelf: "center",
    bottom: -19,
  },
  // defaultShadows,
]
const muteButtonTopStyle = [
  {
    position: "absolute",
    alignSelf: "center",
    top: 8,
  },
  // defaultShadows,
]
type MuteButtonProps = {
  peer: Peer
  peerName: string | undefined
  muteRemoteUser: (muteCommand: string) => void
  isNotFullscreenPeer: boolean
}

const RenderMuteButton: React.FunctionComponent<MuteButtonProps> = ({
  peer,
  peerName,
  muteRemoteUser,
  isNotFullscreenPeer = true,
}) => {
  const [isLoading, setLoading] = useState(false)
  useEffect(() => {
    if (peer.isMuted) {
      setLoading(false)
    }
  }, [peer.isMuted])

  const onMuteRemotePressed = (): void => {
    if (isLoading) {
      return
    }
    muteRemoteUser(`${CallSignal.muted} ${peerName || ""} ${peer.agoraUuid}`)
    setLoading(true)
  }
  const renderIcon = (): React.ReactElement => {
    if (isLoading) {
      return <ActivityIndicator size={muteIconSize} color={color.white} />
    }
    if (peer.isMuted) {
      return (
        <Ionicons name="mic-off" size={muteIconSize + 5} color={color.red} />
      )
    }
    return (
      <Ionicons
        name="mic"
        size={muteIconSize + 5}
        color={color.white}
        style={styles.minActiveIconOtherUsers}
      />
    )
  }
  return (
    <OtherUserMuteCircleButtonWrapper
      style={isNotFullscreenPeer ? muteButtonBottomStyle : muteButtonTopStyle}
      onPress={onMuteRemotePressed}
    >
      <OtherUserMuteCircleButton
        onPress={onMuteRemotePressed}
        backgroundColor={peer.isMuted ? color.white : color.mainBlue}
        size={muteIconSize * 1.86}
        style={defaultShadows}
        hitSlop={DEFAULT_HIT_SLOP}
      >
        {renderIcon()}
      </OtherUserMuteCircleButton>
    </OtherUserMuteCircleButtonWrapper>
  )
}

// const FetchBlankProfileHook = ({
//   hasSearchedProfile,
//   agoraUuid,
//   setNewJoinedUser,
// }: {
//   hasSearchedProfile: boolean
//   agoraUuid: number | undefined
//   setNewJoinedUser: (newJoinedUser: number) => void
// }) => {
//   // If there's new users joined in with no profile info, store it in state
//   React.useEffect(() => {
//     !hasSearchedProfile && agoraUuid && setNewJoinedUser(agoraUuid)
//   }, [hasSearchedProfile, agoraUuid, setNewJoinedUser])

//   return null
// }

// TODO: Refactor the logic here, too complex

class CallingProfilesComponent extends React.Component<
  CallingProfilesProps,
  CallingProfilesStateType
> {
  // state: CallingProfilesStateType = { newJoinedUsers: [] }

  fullscreenUid: number | null = null

  public shouldComponentUpdate(
    prevProps: CallingProfilesProps,
    prevState: CallingProfilesStateType
  ): boolean {
    return (
      !_.isEqual(this.props, prevProps) || !_.isEqual(this.state, prevState)
    )
  }

  // public setNewJoinedUser = (newJoinedUser: number): void => {
  //   const { newJoinedUsers } = this.state
  //   !newJoinedUsers.includes(newJoinedUser) &&
  //     this.setState({
  //       newJoinedUsers: [...newJoinedUsers, newJoinedUser],
  //     })
  // }

  // eslint-disable-next-line complexity
  private readonly renderProfile = (
    fullscreenUid: number | undefined | null = NaN,
    peer?: Peer
  ) => {
    const {
      me,
      chatUser,
      muteRemoteUser,
      channel,
      audioSetting,
      isGroup,
    } = this.props
    if (peer && !peer.isActive) return null
    // Agora SDK set uid 0 for the volume detection of the local user
    if (fullscreenUid || fullscreenUid === 0) {
      return (
        <Profile fullscreen>
          {fullscreenUid === 0 || fullscreenUid === me.id ? (
            <LocalVideo
              style={styles.video}
              channelId={shortenChannelId(channel)}
            />
          ) : (
            <RemoteVideo
              style={styles.video}
              uid={fullscreenUid}
              channelId={shortenChannelId(channel)}
            />
          )}
        </Profile>
      )
    }
    const isMe = peer?.agoraUuid === me.id
    const isSpeaking = isMe ? audioSetting.isSpeaking : !!peer?.isSpeaking
    const searchProfile = chatUser?.find((user) => user.id === peer?.agoraUuid)
    const profile = {
      ...peer,
      username: isMe ? me.username : searchProfile?.username,
      theme_color: isMe ? me.theme_color : searchProfile?.theme_color,
      url: isMe ? me.avatar.url : searchProfile?.avatar.url,
    }

    const isNotFullscreenPeer =
      profile.agoraUuid &&
      profile.agoraUuid !== this.fullscreenUid &&
      !(isMe && this.fullscreenUid === 0)

    const shouldHide = !isGroup && !isNotFullscreenPeer

    const shouldDisplayMuteButton = peer && !isMe && isGroup
    const shouldDisplayMuteIcon =
      (!isGroup && peer?.isMuted) ||
      (isGroup && isMe && peer?.isMuted && !peer?.isVideoEnabled)

    return shouldHide ? null : (
      <ProfileShadowWrapper
        style={Platform.OS === "ios" && defaultShadows}
        key={peer?.agoraUuid}
      >
        <Profile
          style={Platform.OS === "android" && defaultShadows}
          isNotFullscreenPeer={isNotFullscreenPeer}
          isSpeaking={isSpeaking}
        >
          {isNotFullscreenPeer &&
            (profile.isVideoEnabled && profile.agoraUuid ? (
              peer && isMe ? (
                <LocalVideo
                  style={styles.video}
                  channelId={shortenChannelId(channel)}
                />
              ) : (
                <RemoteVideo
                  style={styles.video}
                  uid={profile.agoraUuid}
                  channelId={shortenChannelId(channel)}
                />
              )
            ) : (
              <SquareAvatar
                // eslint-disable-next-line react-perf/jsx-no-new-object-as-prop
                source={profile.url ? { uri: profile.url } : defaultAvatarImage}
              />
            ))}
          <UsernameWrapper isNotFullscreenPeer={isNotFullscreenPeer}>
            {!isNotFullscreenPeer && (
              <FontAwesome
                name="video-camera"
                size={12}
                color={color.mainBlue}
              />
            )}
            <Username color={profile.theme_color} numberOfLines={1}>
              {`  ${profile.username}  `}
            </Username>
          </UsernameWrapper>
          {shouldDisplayMuteIcon && MuteIcon(24, false)}
        </Profile>
        {shouldDisplayMuteButton && (
          <RenderMuteButton
            peer={peer}
            peerName={profile.username}
            muteRemoteUser={muteRemoteUser}
            isNotFullscreenPeer={!!isNotFullscreenPeer}
          />
        )}
        {/* // renderMuteButton(
      //   peer,
      //   profile.username,
      //   muteRemoteUser,
      //   !!isNotFullscreenPeer
      // )} */}
      </ProfileShadowWrapper>
    )
  }

  private calculateFullscreenUid = (peersWithMe: Peer[]): void => {
    const { callingFullScreenMode, activePeer, me, isGroup } = this.props
    if (!isGroup && callingFullScreenMode) {
      const activePeerVideos = peersWithMe.filter((peer) => peer.isVideoEnabled)
      const anyOneButMeWithActiveVideo = activePeerVideos.some(
        (peer) => peer.agoraUuid !== me.id
      )
      if (anyOneButMeWithActiveVideo) {
        this.fullscreenUid =
          activePeerVideos.find((peer) => peer.agoraUuid !== me.id)
            ?.agoraUuid || null
      } else {
        this.fullscreenUid =
          activePeerVideos.find((peer) => peer.agoraUuid === me.id)
            ?.agoraUuid || null
      }
      return
    }
    if (callingFullScreenMode) {
      const videoSpeakerIndex = peersWithMe.findIndex(
        (item) =>
          item.agoraUuid === activePeer ||
          (activePeer === 0 && item.agoraUuid === me.id)
      )
      const firstVideoIndex = peersWithMe.findIndex(
        (item) => item.isVideoEnabled
      )
      if (
        videoSpeakerIndex !== -1 &&
        peersWithMe[videoSpeakerIndex].isVideoEnabled
      ) {
        this.fullscreenUid = activePeer
      } else if (firstVideoIndex !== -1) {
        this.fullscreenUid = peersWithMe[firstVideoIndex].agoraUuid
      }
    } else {
      this.fullscreenUid = null
    }
  }

  // eslint-disable-next-line complexity
  public render(): React.ReactNode {
    const {
      audioSetting,
      peers,
      isInCallingChat,
      me,
      isHost,
      callingFullScreenMode,
      isCaller,
    } = this.props
    const peersArray = [...peers.values()]
    const myPeer = {
      agoraUuid: me.id,
      isMuted: !audioSetting.isAudioEnabled,
      isVideoEnabled: audioSetting.isVideoEnabled,
      isActive: true,
    }
    const peersWithMe = isHost ? peersArray.concat(myPeer) : peersArray
    this.calculateFullscreenUid(peersWithMe)
    // how to disable active peer
    return (
      <ScreenWrapper>
        {isInCallingChat && (
          <>
            <BackgroundProfle>
              {callingFullScreenMode && this.renderProfile(this.fullscreenUid)}
            </BackgroundProfle>

            <CallingWrapper>
              <ProfileContainer>
                {peersWithMe.map((peer) => this.renderProfile(NaN, peer))}
                {isCaller && peers.size === 0 && <OutgoingCallAnimation />}
              </ProfileContainer>
            </CallingWrapper>
          </>
        )}
      </ScreenWrapper>
    )
  }
}
// CallingProfilesComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "CallingProfilesComponent",
//   diffNameColor: "red",
// }
export const CallingProfiles = CallingProfilesComponent
