/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/style-prop-object */
/* eslint-disable import/no-extraneous-dependencies */
import * as Notifications from "expo-notifications"
import { OrderedMap } from "immutable"
import * as React from "react"
import { Animated, Platform } from "react-native"
import { NavigationInjectedProps } from "react-navigation"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import _ from "lodash"
import { Subscription } from "expo-modules-core"

import {
  ChatAction,
  ChatChannel,
  Notification,
  selectNotifications,
  selectNewInterest,
  selectShowPopup,
} from "convose-lib/chat"
import { selectOnboarding, OnboardingAction } from "convose-lib"
import { Interest, InterestsAction, UserInterest } from "convose-lib/interests"
import { Routes } from "convose-lib/router"
import { State } from "convose-lib/store"
import {
  PartnersList,
  selectPartnersListFeature,
  UsersListAction,
} from "convose-lib/users-list"

import { selectToken } from "convose-lib/user"
import { ChatboxListScreenWrapper, TermsText, TermsLink } from "./Styled"
import {
  ChatboxList,
  ConvoseAlert,
  InterestPopup,
  Navbar,
  StatusBarAuto,
} from "../../components"
import { AgreementIcon } from "./AgreementIcon"

type DispatchToProps = {
  readonly closeNotification: (notification: Notification) => void
  readonly hideOnboarding: () => void
}

type ChatBoxListToProps = {
  readonly notifications: OrderedMap<ChatChannel, Notification>
  readonly partners: PartnersList | null
  readonly searchResults: ReadonlyArray<Interest> | null
  readonly newInterest: UserInterest
  readonly showPopup: boolean
  readonly onboarding: boolean
  readonly authToken: string
}

type AllProps = NavigationInjectedProps &
  ChatBoxListToProps &
  DispatchToProps & { theme: any }
export class ChatboxListScreenComponent extends React.Component<AllProps> {
  public notificationSubscription!: Subscription

  public async componentDidMount(): Promise<void> {
    this.notificationSubscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        this.handleNotification(response.notification.request.content)
      }
    )

    if (Platform.OS === "android") {
      const lastNotificationResponse = await Notifications.getLastNotificationResponseAsync()
      if (
        lastNotificationResponse &&
        lastNotificationResponse.notification.request.content &&
        lastNotificationResponse.actionIdentifier ===
          Notifications.DEFAULT_ACTION_IDENTIFIER
      ) {
        this.handleNotification(
          lastNotificationResponse.notification.request.content
        )
      }
    }
  }

  public shouldComponentUpdate(prevProps: AllProps): boolean {
    return !_.isEqual(this.props, prevProps)
  }

  public componentDidUpdate(prevProps: AllProps): void {
    const { authToken } = this.props
    if (prevProps.authToken !== authToken) {
      this.dismissAllNotifications()
    }
  }

  public componentWillUnmount(): void {
    this.notificationSubscription && this.notificationSubscription.remove()
  }

  public dismissAllNotifications = (): void => {
    Notifications.dismissAllNotificationsAsync()
  }

  private readonly handleNotification = (notification: any) => {
    this.dismissAllNotifications()
    const pnChannel = notification.data.chat
    const { navigation } = this.props
    // const partnerExist =
    //   partners &&
    //   partners.chat.findIndex(
    //     (chat: ChatSummary) => chat.channel === pnChannel
    //   ) !== -1
    // partnerExist &&
    navigation &&
      navigation.navigate(Routes.ChatDrawer, {
        screen: Routes.Chat,
        params: {
          channel: pnChannel,
          chatUser: {},
        },
      })
  }

  public readonly handleOnAgreePress = (): void => {
    const { hideOnboarding } = this.props
    hideOnboarding()
  }

  public readonly navigateToTermsContent = (): void => {
    const { navigation } = this.props
    navigation.navigate(Routes.OnboardingTermsContent, {})
  }

  public render(): React.ReactNode {
    const { newInterest, showPopup, onboarding, navigation } = this.props
    const animatedValue = new Animated.Value(0)
    const interpolateOpacity = animatedValue.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
    })

    if (showPopup) {
      Animated.sequence([
        Animated.timing(animatedValue, {
          duration: 500,
          toValue: 100,
          useNativeDriver: true,
        }),
        Animated.delay(3000),
        Animated.timing(animatedValue, {
          duration: 500,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]).start()
    }

    return (
      <ChatboxListScreenWrapper>
        {!!onboarding && (
          <ConvoseAlert
            isVisible={onboarding}
            title="Agree to terms"
            icon={<AgreementIcon />}
            description={
              <TermsText>
                Do you agree to Convose’s
                <TermsLink onPress={this.navigateToTermsContent}>
                  {" "}
                  terms and conditions of use?
                </TermsLink>
              </TermsText>
            }
            // eslint-disable-next-line react-perf/jsx-no-new-array-as-prop
            buttons={[
              {
                title: "I agree",
                onPress: this.handleOnAgreePress,
              },
            ]}
          />
        )}
        <StatusBarAuto />
        <ChatboxList isFocused={navigation.isFocused} />
        {showPopup && (
          <InterestPopup interest={newInterest} opacity={interpolateOpacity} />
        )}
        <Navbar />
      </ChatboxListScreenWrapper>
    )
  }
}

const mapStateToProps = (state: State): ChatBoxListToProps => {
  return {
    partners: selectPartnersListFeature(state),
    notifications: selectNotifications(state),
    searchResults: state.interests.searchResults,
    newInterest: selectNewInterest(state),
    showPopup: selectShowPopup(state),
    onboarding: selectOnboarding(state),
    authToken: selectToken(state),
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<
    ChatAction | OnboardingAction | UsersListAction | InterestsAction
  >
): DispatchToProps => ({
  closeNotification: (notification: Notification) =>
    dispatch(ChatAction.removeNotification(notification)),
  hideOnboarding: () => dispatch(OnboardingAction.hideOnboarding()),
})
// ChatboxListScreenComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "ChatboxListScreenComponent",
//   diffNameColor: "red",
// }
export const ChatboxListScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatboxListScreenComponent)
