/* eslint-disable @typescript-eslint/no-explicit-any */
import ActionCable from "react-native-actioncable"

export const WS_ACTIONCABLE = "wss://api.convose.com/cable"
export const WS_ACTIONCABLE_CHANNEL_PARTNERS = "PartnersChannel"
export const WS_ACTIONCABLE_CHANNEL_SUGGESTIONS = "SuggestionsChannel"
export const WS_ACTIONCABLE_CHANNEL_NEWMESSAGECHANNEL = "NewMessageChannel"

export class Cable {
  public consumer: any

  public connect(token: string): void {
    this.consumer = ActionCable.createConsumer(
      `${WS_ACTIONCABLE}${token ? `?token=${token}` : ""}`
    )
  }

  public getConsumer(token: string): any {
    if (!this.consumer) {
      this.connect(token)
    }
    return this.consumer
  }

  public closeConnection(): void {
    if (this.consumer) {
      this.consumer.disconnect()
    }
    delete this.consumer
  }
}
