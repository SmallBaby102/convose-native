import { Interest } from "convose-lib/interests"

export type InterestsBarState = {
  readonly focus: boolean
  readonly text: string
}

export type InterestsBarProps = {
  readonly interestsCount: number
  readonly onCancel: () => void
  readonly onCreate: (interest: Interest) => void
  readonly onSearch: (text: string) => void
  readonly partners?: boolean
  readonly showInterests: boolean
  readonly showResults: boolean
  readonly unreadMessagesCount: number
  readonly getProfilePosition: (profile: any) => void
}
