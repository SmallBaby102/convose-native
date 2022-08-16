/* eslint-disable @typescript-eslint/no-explicit-any */
import { OrderedMap } from "immutable"
import * as React from "react"

import { ChatChannel, Notification } from "convose-lib/chat"
import { InboxConversationBox } from "../../components/InboxConversationBox"

export const Notifications = (
  notifications: OrderedMap<ChatChannel, Notification>,
  closeNotification: (notification: Notification) => void
): React.ReactNode =>
  notifications
    .toList()
    .filter((notification) => (notification ? !notification.showed : false))
    .map(
      (notification, index) =>
        notification && (
          <InboxConversationBox
            chatSummary={notification as any}
            key={notification.channel}
            index={index}
            notification
            closeNotification={closeNotification as any}
          />
        )
    )
