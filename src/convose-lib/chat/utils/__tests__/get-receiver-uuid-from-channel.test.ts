import { CHAT_CHANNEL_JOINER } from "../"
import { getReceiverUuidFromChannel } from "../get-receiver-uuid-from-channel"

describe("getReceiverUuidFromChannel", () => {
  it("checks uuid extraction", () => {
    const uuid = "bbb"
    const channelName = `aaa${CHAT_CHANNEL_JOINER}${uuid}`
    const name = getReceiverUuidFromChannel(channelName, uuid)
    expect(name).toEqual("aaa")
  })
})
