import { View, Animated, TouchableOpacity, StyleSheet } from "react-native"
import styled from "styled-components"
import { CenteredText, color, height, Props } from "convose-styles"
import FastImage from "react-native-fast-image"
import { ongoingCallHeight, statusBarHeight, width } from "../../../styles"
import { IconButton } from "../IconButton"

import { PrimaryButton } from "../PrimaryButton"

export const styles = StyleSheet.create({
  minActiveIcon: {
    marginLeft: 2,
  },
  minActiveIconOtherUsers: {
    marginLeft: 1,
  },
  video: { width: "100%", height: "100%" },
})

export const ScreenWrapper = styled(View)`
  flex: 1;
  background-color: ${(props: Props) => props.color || props.theme.statusBar};
  width: 100%;
  height: 100%;
  align-items: center;
  position: absolute;
`

export const CallingWrapper = styled(View)`
  flex: 1;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  width: 100%;
`

export const BackButton = styled(IconButton)`
  position: absolute;
  margin-top: ${statusBarHeight + ongoingCallHeight};
  margin-left: 25;
`

export const CommonInterests = styled(View)`
  flex: 1;
  align-content: center;
  justify-content: flex-start;
  padding-top: 50;
`

export const TextWrapper = styled(CenteredText)`
  align-content: center;
  font-style: ${(props: Props) => (props.italic ? "italic" : "normal")};
  color: ${(props: Props) =>
    props.color ? props.color : props.theme.main.text};
  font-size: ${(props: Props) => (props.fontSize ? props.fontSize : 16)};
  justify-content: center;
  text-align: center;
  font-family: Popins-bold;
  background: ${(props: Props) =>
    props.background ? props.background : props.theme.callingUnmuteAlert};
  padding-horizontal: 5;
`

export const UsernameWrapper = styled(View)`
  overflow: hidden;
  border-bottom-right-radius: 10;
  background: ${color.white_transparent_light};
  ${(props: { isNotFullscreenPeer: boolean }) =>
    props.isNotFullscreenPeer
      ? "position: absolute;"
      : "align-items: center; flex-direction: row"};
`

export const Username = styled(CenteredText)`
  align-content: center;
  color: ${(props: Props) => (props.color ? props.color : color.black)};
  font-size: 12;
  justify-content: center;
  text-align: center;
  font-family: Popins-bold;
  background: ${color.transparent};
`

export const ButtonWrapper = styled(View)`
  width: 100;
  right: 0;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: 65;
  margin-bottom: ${(props: Props) => props.height || 0};
  height: 250;
  flex-direction: column;
`
export const CircleButton = styled(TouchableOpacity)`
  border-radius: 50;
  aspect-ratio: 1;
  height: ${(props: Props) => (props.size ? props.size : "50px")};
  width: ${(props: Props) => (props.size ? props.size : "50px")};
  justify-content: center;
  align-items: center;
  margin: ${(props: Props) => (props.margin ? props.margin : "4px")};
  background: ${(props: Props) =>
    props.backgroundColor ? props.backgroundColor : "rgba(0, 0 ,0 ,0.2)"};
`
export const OtherUserMuteCircleButtonWrapper = styled(TouchableOpacity)`
  border-radius: 50;
  elevation: 10000;
  padding: 4px;
`
export const OtherUserMuteCircleButton = styled(CircleButton)`
  align-self: center;
`
export const ProfileContainer = styled(View)`
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: flex-end;
  height: 20%;
  width: 100%;
  margin-top: ${statusBarHeight};
`

export const ProfileShadowWrapper = styled(View)`
  border-radius: 10;
  position: relative;
  align-items: center;
  justify-content: center;
`

export const CallingIndicationWrapper = styled(View)`
  border-radius: 20;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: ${color.white};
  padding-horizontal: ${(props: { isTotalButton: boolean }) =>
    props.isTotalButton ? "6px" : "0px"};
  padding-vertical: ${(props: { isTotalButton: boolean }) =>
    props.isTotalButton ? "2px" : "0px"};
  margin-right: ${(props: { isTotalButton: boolean }) =>
    props.isTotalButton ? "6px" : "0"};
`

export const Profile = styled(View)`
  border-radius: 10;
  margin-horizontal: 1%;
  border-width: ${(props: { isSpeaking: boolean }) =>
    props.isSpeaking ? 3 : 0};
  border-color: ${color.mainBlue};
  width: ${(props: { fullscreen: boolean }) =>
    props.fullscreen ? "100%" : width * 0.22};
  ${(props: { isNotFullscreenPeer: boolean; fullscreen: boolean }) =>
    props.isNotFullscreenPeer || props.fullscreen
      ? "height: 100%;"
      : "flex-direction: column; align-items: center;"};
  overflow: hidden;
  background: white;
`

export const SquareAvatar = styled(FastImage)`
  width: 100%;
  height: 100%;
`
export const StyledImage = styled(FastImage)`
  height: ${(props: Props) => (props.height ? props.height : 60)}px;
  width: ${(props: Props) => (props.height ? props.height : 60)}px;
  border-radius: ${(props: Props) =>
    props.borderRadius ? props.borderRadius : 90}px;
`

export const BackgroundProfle = styled(View)`
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  position: absolute;
`

export const Blank = styled(View)`
  width: 50px;
`
export const AlertModal = styled(TouchableOpacity)`
  bottom: 0;
  height: 100%;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  background: ${color.black_transparent_light};
`
type ContainerProps = {
  insetBottom: number
}
export const UnmuteAlertContainer = styled.View`
  left: 0;
  right: 0;
  top: 0;
  bottom: ${(props: ContainerProps) => props.insetBottom}px;
  position: absolute;
`
type PermissionProps = { isPermissionAlert: boolean }
export const AlertDialog = styled(View)`
  ${(props: PermissionProps) =>
    !props.isPermissionAlert && "position: absolute"};
  width: ${(props: PermissionProps) => (props.isPermissionAlert ? "90%" : 280)};
  bottom: ${(props: PermissionProps) => (props.isPermissionAlert ? 0 : 360)};
  right: ${(props: PermissionProps) => (props.isPermissionAlert ? 0 : 20)};
  ${(props: PermissionProps) => props.isPermissionAlert && "margin: auto"};
  ${(props: PermissionProps) => props.isPermissionAlert && "top: 0"};
  ${(props: PermissionProps) => props.isPermissionAlert && "left: 0"};
  background: ${(props: Props) => props.theme.callingUnmuteAlert};
  border-radius: 15;
  align-items: center;
  justify-content: center;
  padding-vertical: 30px;
`

export const AlertButton = styled(PrimaryButton)`
  margin-top: 20px;
  width: 180px;
`
export const AlertDialogTriangle = styled(View)`
  position: absolute;
  bottom: 350;
  right: 40;
  border-top-color: ${(props: Props) => props.theme.callingUnmuteAlert};
  border-left-color: transparent;
  border-right-color: transparent;
  border-bottom-color: transparent;
`
export const AudiencesButtonWrapper = styled(View)`
  position: absolute;
  background: ${color.transparent};
  width: 200;
  top: ${height * 0.2 + statusBarHeight + 10};
  right: 0;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
`

export const MuteIconWrapper = styled(View)`
  width: ${(props: Props) => (props.size ? props.size : 16)};
  height: ${(props: Props) => (props.size ? props.size : 16)};
  border-radius: 20;
  background: ${(props: { dark: boolean }) =>
    props.dark ? color.black : color.white};
  position: absolute;
  bottom: ${(props: { dark: boolean }) => (props.dark ? 0 : 4)};
  ${(props: { dark: boolean }) => (props.dark ? "left: 0" : "right: 4")};
  align-items: center;
  justify-content: center;
`
export const OutgoingCallWrapper = styled(View)`
  position: absolute;
  elevation: 10;
  width: 0;
  height: 0;
  top: 50%;
  right: 12%;
  align-items: center;
  justify-content: center;
  background: ${color.transparent};
`
export const Ripple = styled(Animated.View)`
  position: absolute;
  width: 50;
  height: 50;
  background: ${color.green};
  border-radius: 100;
`
