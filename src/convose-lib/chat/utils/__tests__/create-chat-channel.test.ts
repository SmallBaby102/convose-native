import { CHAT_CHANNEL_JOINER } from "../"
import { createChatChannelId } from "../create-chat-channel-id"

describe("createChatChannel", () => {
  it("generate channel id", () => {
    const myUuid = "aaa"
    const userUuid = "bbb"
    const name = createChatChannelId(userUuid, myUuid)
    expect(name).toEqual(myUuid + CHAT_CHANNEL_JOINER + userUuid)
  })
})
