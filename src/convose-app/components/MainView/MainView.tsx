/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable complexity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import {
  AppState,
  AppStateStatus,
  Appearance,
  TouchableWithoutFeedback,
  StyleSheet,
} from "react-native"
import NetInfo, { NetInfoSubscription } from "@react-native-community/netinfo"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import { omit } from "lodash"
import { SafeAreaProvider } from "react-native-safe-area-context"
import {
  AppAction,
  initApis,
  selectIsAppLoading,
  selectIsDarkMode,
} from "convose-lib/app"
import {
  ChatAction,
  ChatChannel,
  selectNotifications,
  selectOpenChatChannel,
  Notification,
  ChatSummary,
  selectAllPendingMessages,
  ChannelPendingMessages,
  MessageToPublish,
} from "convose-lib/chat"
import {
  logEvent,
  registerForPushNotificationsAsync,
} from "convose-lib/services"
import { State } from "convose-lib/store"
import {
  selectToast,
  ToastAction,
  ToastProps,
  ToastState,
  ToastType,
} from "convose-lib/toast"
import {
  LoginType,
  PushNotificationToken,
  selectExpoPushToken,
  selectIsGettingExpoPushToken,
  selectSocialLoginType,
  selectToken,
  UserAction,
} from "convose-lib/user"
import {
  selectPartnersFeature,
  selectUnreadLoadingPartnerFeature,
  UsersListAction,
} from "convose-lib/users-list"
import { selectOnboarding } from "convose-lib"
import * as Linking from "expo-linking"
import { Routes } from "convose-lib/router"

import * as SplashScreen from "expo-splash-screen"
import { OrderedMap } from "immutable"
import { ThemeProvider } from "styled-components"
import changeNavigationBarColor from "react-native-navigation-bar-color"
import { selectCallingDisplayText } from "convose-lib/calling"
import { isDevice } from "expo-device"
import { createConvoseAlertRef } from "../../RootConvoseAlert"
import {
  componentColorsLight,
  componentColorsDark,
  color,
} from "../../../styles/colors"
import { Notifications } from "../Notifications"
import { cacheFonts } from "../../../styles"
import * as RootNavigation from "../../RootNavigation"
import CallingNotification from "../../components/CallingNotification/CallingNotification"
import {
  EndCallModal,
  MainViewWrapper,
  ModalContent,
  StyledRootStack,
} from "./Styled"
import { Toast } from "../../components/Toast"
import { ConvoseAlert } from "../ConvoseAlert"
import { AuthButtonList } from "../AuthButtonList"
import { TouchableWithoutFeedbackArea } from "../ModalWrapper"

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
})

type MainViewProps = {
  readonly toast: ToastState
  readonly authToken: string
  readonly isAppLoading: boolean
  readonly openChat: ChatChannel | null
  readonly notifications: OrderedMap<ChatChannel, Notification>
  readonly onboarding: boolean
  readonly loadingUnreadPartners: boolean
  readonly partners: ReadonlyArray<ChatSummary> | null
  readonly darkMode: boolean | null
  readonly isPickingImage: boolean
  readonly isTakingImage: boolean
  readonly callingDisplayText: string
  readonly allPendingMessages: ChannelPendingMessages[]
  readonly socialLoginType: LoginType | undefined
  readonly expoPushToken: PushNotificationToken
  readonly isGettingExpoPushToken: boolean
}

type MainViewDispatchProps = {
  readonly initApp: () => void
  readonly getUsersList: () => void
  readonly getUnreadPartnersList: () => void
  readonly stopSendingPushNotifications: () => void
  readonly startSendingPushNotifications: () => void
  readonly stopGettingUsersList: () => void
  readonly startNotifying: () => void
  readonly hideSplash: () => void
  readonly unexpectedErrorHandler: (error: Error) => void
  readonly showToast: (toast: ToastProps) => void
  readonly showPersistantToast: (toast: ToastProps) => void
  readonly dismissToast: () => void
  readonly setShouldFetchAfterNetRecover: () => void
  readonly closeNotification: (notification: Notification) => void
  readonly resetHistory: () => void
  readonly resetPartnersList: () => void
  readonly changeTheme: (darkMode: boolean) => void
  readonly setIsPickingImage: (isPickingImage: boolean) => void
  readonly setIsTakingImage: (isTakingImage: boolean) => void
  readonly subscribeChat: (chatChannel: string) => void
  readonly unsubscribeChat: (chatChannel: string) => void
  readonly setFayeIsReady: () => void
  readonly publishMessage: (
    message: MessageToPublish,
    channel: ChatChannel
  ) => void
  readonly closeSocialLogin: () => void
  readonly registerPushNotifications: (token: PushNotificationToken) => void
  readonly clearPushNotification: () => void
  readonly requestingPushNotifications: () => void
  readonly requestingPushNotificationsFailure: () => void
}

type MainViewPropsType = MainViewProps & MainViewDispatchProps
const handleUrl = () => {
  RootNavigation.navigate(Routes.Login, "")
}
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
})
class MainViewComponent extends React.Component<MainViewPropsType> {
  private unsubscribeNetInfo: NetInfoSubscription | undefined

  public async componentDidMount(): Promise<void> {
    const { initApp, darkMode, changeTheme, showPersistantToast } = this.props
    initApp()
    this.prepareResources()

    if (darkMode === null) {
      const systemColorScheme = Appearance.getColorScheme()
      const isDarkMode = systemColorScheme === "dark"
      const navBarColor = isDarkMode ? color.darkLevel1 : color.white
      changeTheme(systemColorScheme === "dark")
      changeNavigationBarColor(navBarColor, !isDarkMode, false)
    } else {
      const navBarColor = darkMode ? color.darkLevel1 : color.white
      changeNavigationBarColor(navBarColor, !darkMode, true)
    }

    AppState.addEventListener("change", this.handleAppStateChange)
    Linking.addEventListener("url", handleUrl)
    this.unsubscribeNetInfo = NetInfo.addEventListener((state) => {
      !state.isConnected
        ? showPersistantToast({
            message: "No internet connection",
            type: ToastType.error,
          })
        : this.handleNetRecovery()
    })
  }

  public async componentDidUpdate(prevProps: MainViewPropsType): Promise<void> {
    const { authToken, expoPushToken, isGettingExpoPushToken } = this.props
    if (prevProps.authToken && prevProps.authToken !== authToken) {
      this.refreshUser()
    }

    if (!isGettingExpoPushToken && !expoPushToken && isDevice) {
      this.registerPushNotificationToken()
    }
  }

  public componentWillUnmount(): void {
    AppState.removeEventListener("change", this.handleAppStateChange)
    this.unsubscribeNetInfo && this.unsubscribeNetInfo()
  }

  public registerPushNotificationToken = async (): Promise<void> => {
    const {
      registerPushNotifications,
      requestingPushNotifications,
      requestingPushNotificationsFailure,
    } = this.props
    requestingPushNotifications()
    const expoPushToken = await registerForPushNotificationsAsync()
    if (expoPushToken && typeof expoPushToken === "string") {
      registerPushNotifications(expoPushToken)
    } else {
      requestingPushNotificationsFailure()
    }
  }

  public refreshUser = async (): Promise<void> => {
    const {
      resetHistory,
      resetPartnersList,
      stopSendingPushNotifications,
      clearPushNotification,
    } = this.props
    resetHistory()
    resetPartnersList()
    clearPushNotification()
    stopSendingPushNotifications()
  }

  public resendPendingMessages = (): void => {
    const { allPendingMessages, publishMessage } = this.props
    const messagesToSend: {
      message: MessageToPublish
      chatChannel: ChatChannel
    }[] = []
    allPendingMessages.forEach((pm) => {
      const { chatChannel, pendingMessages } = pm
      pendingMessages.forEach((message) => {
        const messageToSend = omit(message, [
          "created_at",
          "myMessage",
          "receiver",
          "updated_at",
          "publishing",
        ])
        return messagesToSend.push({
          chatChannel,
          message: messageToSend,
        })
      })
    })
    messagesToSend.map((publishMsg) =>
      publishMessage(publishMsg.message, publishMsg.chatChannel)
    )
  }

  handleNetRecovery = () => {
    const {
      openChat,
      setShouldFetchAfterNetRecover,
      dismissToast,
      getUnreadPartnersList,
      loadingUnreadPartners,
      authToken,
      onboarding,
      startNotifying,
    } = this.props
    dismissToast()
    openChat && setShouldFetchAfterNetRecover()
    authToken &&
      !loadingUnreadPartners &&
      !onboarding &&
      getUnreadPartnersList()
    authToken && !onboarding && startNotifying()
    this.resendPendingMessages()
  }

  prepareResources = async () => {
    const { setFayeIsReady, hideSplash } = this.props
    try {
      await initApis(setFayeIsReady)
      await cacheFonts
    } catch (e: any) {
      logEvent(e)
    } finally {
      hideSplash()
      await SplashScreen.hideAsync()
    }
  }

  private readonly handleAppStateChange = (appState: AppStateStatus) => {
    const {
      stopGettingUsersList,
      authToken,
      startNotifying,
      startSendingPushNotifications,
      getUsersList,
      getUnreadPartnersList,
      stopSendingPushNotifications,
      openChat,
      onboarding,
      setShouldFetchAfterNetRecover,
      loadingUnreadPartners,
      isPickingImage,
      isTakingImage,
      setIsPickingImage,
      setIsTakingImage,
      subscribeChat,
      unsubscribeChat,
    } = this.props
    if (
      appState.match(/inactive|background/) &&
      !isPickingImage &&
      !isTakingImage
    ) {
      stopGettingUsersList()
      !onboarding && authToken && startSendingPushNotifications()
      openChat && unsubscribeChat(openChat)
    }

    if (appState === "active") {
      if (!isPickingImage && !isTakingImage) {
        getUsersList()
        authToken &&
          !loadingUnreadPartners &&
          !onboarding &&
          getUnreadPartnersList()
        !onboarding && startNotifying()
        authToken && stopSendingPushNotifications()
        openChat && setShouldFetchAfterNetRecover()
        openChat && subscribeChat(openChat)
      } else {
        isPickingImage ? setIsPickingImage(false) : setIsTakingImage(false)
      }
    }
  }

  public renderCallingDisplayText(): React.ReactNode {
    const { callingDisplayText } = this.props
    return callingDisplayText ? (
      <EndCallModal>
        <ModalContent>{callingDisplayText}</ModalContent>
      </EndCallModal>
    ) : null
  }

  public renderSocialLogins = (): React.ReactNode => {
    const { socialLoginType, closeSocialLogin } = this.props
    return (
      <>
        {!!socialLoginType && (
          <TouchableWithoutFeedback onPress={closeSocialLogin}>
            <TouchableWithoutFeedbackArea style={styles.wrapper} />
          </TouchableWithoutFeedback>
        )}
        <AuthButtonList
          loginOrSignUp={socialLoginType?.toString()}
          onAuthCompleted={closeSocialLogin}
          onHideComponent={closeSocialLogin}
          useAnimation
          showButtonsOnAnimationUse={!!socialLoginType}
        />
      </>
    )
  }

  public render(): React.ReactNode {
    const {
      toast,
      isAppLoading,
      notifications,
      openChat,
      closeNotification,
      onboarding,
      darkMode,
    } = this.props

    if (isAppLoading) {
      return null
    }
    const filteredNotifications = openChat
      ? notifications.delete(openChat)
      : notifications
    return (
      <ThemeProvider
        theme={darkMode ? componentColorsDark : componentColorsLight}
      >
        <SafeAreaProvider>
          <MainViewWrapper>
            <ConvoseAlert ref={createConvoseAlertRef} />
            <StyledRootStack />
            {toast && <Toast {...toast} />}
            {!onboarding &&
              Notifications(filteredNotifications, closeNotification)}
            <CallingNotification />
            {this.renderSocialLogins()}
            {this.renderCallingDisplayText()}
          </MainViewWrapper>
        </SafeAreaProvider>
      </ThemeProvider>
    )
  }
}

const mapStateToProps = (state: State): MainViewProps => ({
  authToken: selectToken(state),
  isAppLoading: selectIsAppLoading(state),
  darkMode: selectIsDarkMode(state),
  toast: selectToast(state),
  openChat: selectOpenChatChannel(state),
  notifications: selectNotifications(state),
  onboarding: selectOnboarding(state),
  loadingUnreadPartners: selectUnreadLoadingPartnerFeature(state),
  partners: selectPartnersFeature(state),
  isPickingImage: state.chat.isPickingImage,
  isTakingImage: state.chat.isTakingImage,
  callingDisplayText: selectCallingDisplayText(state),
  allPendingMessages: selectAllPendingMessages(state),
  socialLoginType: selectSocialLoginType(state),
  expoPushToken: selectExpoPushToken(state),
  isGettingExpoPushToken: selectIsGettingExpoPushToken(state),
})

const mapDispatchToProps = (dispatch: Dispatch): MainViewDispatchProps => ({
  getUnreadPartnersList: () =>
    dispatch(UsersListAction.getUnreadPartnersList()),
  getUsersList: () => dispatch(UsersListAction.getUsersList()),
  hideSplash: () => dispatch(AppAction.hideSplash()),
  initApp: () => dispatch(AppAction.initializeApp()),
  changeTheme: (darkMode: boolean) => dispatch(AppAction.changeTheme(darkMode)),
  startNotifying: () => dispatch(ChatAction.startNotifying()),
  startSendingPushNotifications: () => dispatch(UserAction.setUserInactive()),
  stopGettingUsersList: () => dispatch(UsersListAction.stopGettingUsersList()),
  stopSendingPushNotifications: () => dispatch(UserAction.setUserActive()),
  unexpectedErrorHandler: (error: Error) =>
    dispatch(AppAction.unexpectedError(error)),
  showToast: (toast: ToastProps) => dispatch(ToastAction.showToast(toast)),
  showPersistantToast: (toast: ToastProps) =>
    dispatch(ToastAction.showPersistantToast(toast)),
  dismissToast: () => dispatch(ToastAction.hideToast()),
  setShouldFetchAfterNetRecover: () =>
    dispatch(ChatAction.setShouldFetchAfterNetRecover()),
  closeNotification: (notification: Notification) =>
    dispatch(ChatAction.removeNotification(notification)),
  resetHistory: () => dispatch(ChatAction.resetHistory()),
  resetPartnersList: () => dispatch(UsersListAction.resetPartnersList()),
  setIsPickingImage: (isPickingImage: boolean) =>
    dispatch(ChatAction.setIsPickingImage(isPickingImage)),
  setIsTakingImage: (isTakingImage: boolean) =>
    dispatch(ChatAction.setIsTakingImage(isTakingImage)),
  subscribeChat: (chatChannel: ChatChannel) =>
    dispatch(ChatAction.subscribeChat(chatChannel)),
  unsubscribeChat: (chatChannel: ChatChannel) =>
    dispatch(ChatAction.unsubscribeChat(chatChannel)),
  setFayeIsReady: () => dispatch(AppAction.setFayeIsReady()),
  publishMessage: (message: MessageToPublish, channel: ChatChannel) =>
    dispatch(ChatAction.publishMessage(message, channel)),
  closeSocialLogin: () => dispatch(UserAction.closeSocialLogin()),
  registerPushNotifications: (token: PushNotificationToken) =>
    dispatch(UserAction.registerPushNotifications(token)),
  clearPushNotification: () => dispatch(UserAction.clearPushNotification()),
  requestingPushNotifications: () =>
    dispatch(UserAction.requestingPushNotifications()),
  requestingPushNotificationsFailure: () =>
    dispatch(UserAction.requestingPushNotificationsFailure()),
})
// MainViewComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "MainViewComponent",
//   diffNameColor: "red",
// }
export const MainView = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainViewComponent)
