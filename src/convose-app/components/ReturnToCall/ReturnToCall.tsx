import { SafeAreaView } from "react-native"
import React from "react"
import { millisToMinutesAndSeconds } from "convose-lib/utils"
import { Routes } from "convose-lib/router"
import {
  JoinCall,
  selectCallingChannel,
  selectIsCaller,
  selectIsCalling,
  selectJoinCall,
} from "convose-lib/calling"
import { State } from "convose-lib/store"
import { connect } from "react-redux"
import * as RootNavigation from "../../RootNavigation"
import { ButtonWrapper, Label, TextWrapper } from "./styled"

type StateToProps = {
  readonly joinCall: JoinCall
  readonly isCaller: boolean
  readonly isCalling: boolean
  readonly callingChannel: string
}
type ReturnToCallState = {
  readonly callingDuration: string
}

const style = {
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  top: 0,
  elevation: 0,
  zIndex: 20,
}

class ReturnToCallComponent extends React.PureComponent<
  StateToProps,
  ReturnToCallState
> {
  private callingDurationrInterval: number | null

  constructor(props: StateToProps) {
    super(props)
    this.state = {
      callingDuration: "",
    }
    this.callingDurationrInterval = null
  }

  public componentDidMount(): void {
    const { joinCall } = this.props
    if (
      joinCall.isJoined &&
      joinCall.joinedTime > 0 &&
      !this.callingDurationrInterval
    ) {
      this.callingDurationrInterval = setInterval(() => {
        const callingDuration = millisToMinutesAndSeconds(
          Date.now() - joinCall.joinedTime
        )
        this.setState({ callingDuration })
      }, 1000)
    }
  }

  public componentDidUpdate() {
    const { joinCall } = this.props
    if (
      joinCall.isJoined &&
      joinCall.joinedTime > 0 &&
      !this.callingDurationrInterval
    ) {
      this.callingDurationrInterval = setInterval(() => {
        const callingDuration = millisToMinutesAndSeconds(
          Date.now() - joinCall.joinedTime
        )
        this.setState({ callingDuration })
      }, 1000)
    }
  }

  public componentWillUnmount() {
    this.callingDurationrInterval &&
      clearInterval(this.callingDurationrInterval)
    this.callingDurationrInterval = null
  }

  private returnToCall = (): void => {
    const { callingChannel } = this.props
    RootNavigation.navigate(Routes.ChatDrawer, {
      screen: Routes.Chat,
      params: {
        channel: callingChannel,
        chatUser: {},
      },
    })
  }

  public render() {
    const { isCaller, joinCall, isCalling } = this.props
    const { callingDuration } = this.state
    return (joinCall.isJoined && isCalling) || (isCaller && isCalling) ? (
      <SafeAreaView style={style}>
        <ButtonWrapper onPress={this.returnToCall}>
          <TextWrapper isTimerOn={joinCall.joinedTime > 0}>
            <Label>Tap to return to call</Label>
            {joinCall.joinedTime > 0 && (
              <Label timerText>{callingDuration}</Label>
            )}
          </TextWrapper>
        </ButtonWrapper>
      </SafeAreaView>
    ) : null
  }
}

const mapStateToProps = (state: State): StateToProps => ({
  isCaller: selectIsCaller(state),
  joinCall: selectJoinCall(state),
  isCalling: selectIsCalling(state),
  callingChannel: selectCallingChannel(state),
})

export default connect(mapStateToProps)(ReturnToCallComponent)
