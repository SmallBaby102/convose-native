/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import { FlatList, LayoutAnimation, Platform, UIManager } from "react-native"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { NavigationScreenProp } from "react-navigation"
import _ from "lodash"

import { ChatSummary } from "convose-lib/chat"
import { Routes } from "convose-lib/router"
import { State } from "convose-lib/store"
import {
  selectLoadingPartnerFeature,
  selectPartnerHasNextPage,
  selectPartnersFeature,
  UsersListAction,
} from "convose-lib/users-list"
import { PARTNER_LIMIT } from "convose-lib/utils/const"
import { MaterialIndicator } from "react-native-indicators"
import { color } from "convose-styles"
import { ConversationsWrapper, InboxWrapper } from "./Styled"
import { InboxConversationBox } from "../InboxConversationBox"
import { Header } from "../../components/Header"
import * as RootNavigation from "../../RootNavigation"

type StateToProps = {
  readonly partners: ReadonlyArray<ChatSummary> | null
  readonly loadingPartner: boolean
  readonly hasNextPage: boolean
}

type DispatchToProps = {
  readonly getPartnersList: (from: number, limit: number) => void
}
type Props = {
  navigation: NavigationScreenProp<any, any>
}
type AllProps = StateToProps & DispatchToProps & Props
const containerStyle = { paddingBottom: 40, flexGrow: 1 }

const mutationLayout = {
  duration: 100,
  type: LayoutAnimation.Types.easeInEaseOut,
  property: LayoutAnimation.Properties.scaleXY,
}
const layoutAnimConfig = {
  duration: 100,
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
  },
  delete: mutationLayout,
  create: mutationLayout,
}

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}
export class InboxComponent extends React.Component<AllProps> {
  public shouldComponentUpdate(prevProps: AllProps): boolean {
    return !_.isEqual(this.props, prevProps)
  }

  public componentDidUpdate(prevProps: AllProps): void {
    const { partners } = this.props
    if (!_.isEqual(prevProps.partners, partners)) {
      this.handleChangesWithAnimation()
    }
  }

  public handleChangesWithAnimation = (): void => {
    const { navigation } = this.props
    if (navigation.isFocused()) {
      LayoutAnimation.configureNext(layoutAnimConfig)
    }
  }

  private readonly goHome = () => {
    RootNavigation.navigate(Routes.ChatboxList, undefined)
  }

  private readonly renderConversationBoxes = (partner: {
    item: ChatSummary
  }) => (
    <InboxConversationBox
      key={partner.item.channel}
      chatSummary={partner.item}
    />
  )

  private readonly handleOnEndReached = () => {
    const {
      partners,
      getPartnersList,
      loadingPartner,
      hasNextPage,
    } = this.props
    !loadingPartner &&
      hasNextPage &&
      getPartnersList(partners ? partners.length : 0, PARTNER_LIMIT)
  }

  public render(): React.ReactNode {
    const { partners, loadingPartner } = this.props
    return (
      <InboxWrapper>
        <Header
          onBackPress={this.goHome}
          title="Inbox"
          textColor="SystemDefualt"
        />
        <ConversationsWrapper>
          <FlatList
            data={partners}
            keyExtractor={(chat) => chat.channel}
            renderItem={this.renderConversationBoxes}
            onEndReached={this.handleOnEndReached}
            onEndReachedThreshold={0.01}
            contentContainerStyle={containerStyle}
            ListEmptyComponent={<MaterialIndicator color={color.mainBlue} />}
            ListFooterComponent={
              loadingPartner && partners && partners.length > 0 ? (
                <MaterialIndicator color={color.mainBlue} />
              ) : null
            }
          />
        </ConversationsWrapper>
      </InboxWrapper>
    )
  }
}

const mapStateToProps = (state: State): StateToProps => ({
  partners: selectPartnersFeature(state),
  loadingPartner: selectLoadingPartnerFeature(state),
  hasNextPage: selectPartnerHasNextPage(state),
})
const mapDispatchToProps = (
  dispatch: Dispatch<UsersListAction>
): DispatchToProps => ({
  getPartnersList: (from: number, limit: number) =>
    dispatch(UsersListAction.getPartnersList(from, limit)),
})
// InboxComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "InboxComponent",
//   diffNameColor: "red",
// }
export const Inbox = connect(
  mapStateToProps,
  mapDispatchToProps
)(InboxComponent)
