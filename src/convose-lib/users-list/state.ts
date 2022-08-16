import { PartnersList, UsersList } from "./dto"

export type UserListState = {
  readonly partners: PartnersList
  readonly users: UsersList | null
  readonly scrollChatboxes: boolean
  loadingPartner: boolean
  loadingUnreadPartner: boolean
  loadingParticipants: boolean
  hasNextPageParticipants: boolean
}
