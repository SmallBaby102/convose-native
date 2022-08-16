/* eslint-disable import/no-extraneous-dependencies */
import * as React from "react"
import { NavigationInjectedProps } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"

import { ChatAction } from "convose-lib/chat"
import { UsersListAction } from "convose-lib/users-list"
// import { isTablet } from "convose-lib/utils"
// import { shadowStyles } from "convose-styles"
import { Inbox } from "../../components/Inbox"
// import { ModalWrapper } from "../../components/ModalWrapper"
import {
  //  InboxTabletView,
  WhiteBackgroundWrapper,
} from "./Styled"

type InboxDispatchToProps = {
  readonly setInboxIndicator: (value: boolean) => void
  readonly unreadMessagesSeen: () => void
}

export class InboxScreenComponent extends React.Component<
  NavigationInjectedProps & InboxDispatchToProps
> {
  public componentWillUnmount(): void {
    const { unreadMessagesSeen, setInboxIndicator } = this.props
    unreadMessagesSeen()
    setInboxIndicator(false)
  }

  private readonly goBack = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  public render(): React.ReactNode {
    const { navigation } = this.props

    return (
      <WhiteBackgroundWrapper>
        <Inbox navigation={navigation} />
      </WhiteBackgroundWrapper>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch): InboxDispatchToProps => ({
  setInboxIndicator: (value: boolean) =>
    dispatch(ChatAction.setInboxIndicator(value)),
  unreadMessagesSeen: () => dispatch(UsersListAction.unreadMessagesSeen()),
})
// InboxScreenComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "InboxScreenComponent",
//   diffNameColor: "red",
// }
export const InboxScreen = connect(
  null,
  mapDispatchToProps
)(InboxScreenComponent)
