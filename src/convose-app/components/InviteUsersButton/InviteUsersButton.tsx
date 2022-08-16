import React, { FunctionComponent } from "react"
import { TouchableOpacityProps } from "react-native"
import { DEFAULT_HIT_SLOP } from "convose-lib/utils"
import { MaterialIndicator } from "react-native-indicators"
import { color } from "convose-styles"
import { ButtonWrapper, Label } from "./Styled"

type SearchInterestsProps = TouchableOpacityProps & Props

type Props = {
  readonly inviteUsers: () => void
  readonly creating: boolean
}

export const InviteUsersButton: FunctionComponent<SearchInterestsProps> = ({
  inviteUsers,
  creating,
  ...touchableOpacityProps
}) => (
  <ButtonWrapper
    onPress={() => {
      if (!creating) {
        inviteUsers()
      }
    }}
    hitSlop={DEFAULT_HIT_SLOP}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...touchableOpacityProps}
  >
    {!creating ? (
      <Label>Invite</Label>
    ) : (
      <MaterialIndicator color={color.white} />
    )}
  </ButtonWrapper>
)
