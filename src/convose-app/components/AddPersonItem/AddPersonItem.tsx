import _default from "expo-constants"
import * as React from "react"

import { ChatUser, UserStatus } from "convose-lib/chat"
import {
  defaultShadows,
  shadowStyles,
  color,
  AVATAR_SIZE,
} from "convose-styles"
import { Avatar, PresenceIndicator } from "../../components"
import {
  AvatarContainer,
  Body,
  AddPersonContainer,
  ListPersonContainer,
  Section,
  TouchableWrapper,
  Username,
} from "./Styled"

import EmptyCheckIcon from "../../../assets/Icons/components/EmptyCheckIcon"
import FilledCheckIcon from "../../../assets/Icons/components/FilledCheckIcon"

type PropsType = {
  readonly user: ChatUser
  readonly index?: number
  readonly handleTouch: (userId: string) => void
  readonly selected: boolean
  readonly listStyle?: boolean
}

const pickedShadow = shadowStyles({
  elevation: 15,
  shadowColor: color.green,
  borderColor: color.green,
  borderWidth: 3,
  borderRadius: 25,
})

const noShadow = shadowStyles({
  elevation: 0,
  shadowColor: color.white,
  borderWidth: 0,
})

export class AddPersonItemComponent extends React.PureComponent<PropsType> {
  public render(): React.ReactNode {
    const { handleTouch, selected, user, listStyle } = this.props
    if (!user) return null
    const shadows = selected ? pickedShadow : defaultShadows

    if (listStyle) {
      return (
        <ListPersonContainer style={noShadow} pointerEvents="box-none">
          <TouchableWrapper onPress={() => handleTouch(user.uuid)}>
            <AvatarContainer>
              <PresenceIndicator isOnline={user.status === UserStatus.Online}>
                <Avatar
                  height={AVATAR_SIZE}
                  width={AVATAR_SIZE}
                  userAvatar={user.avatar}
                />
              </PresenceIndicator>
            </AvatarContainer>
            <Body>
              <Section>
                <Username color={user.theme_color}>{user.username}</Username>
              </Section>
            </Body>
          </TouchableWrapper>
        </ListPersonContainer>
      )
    }
    return (
      <AddPersonContainer style={shadows} pointerEvents="box-none">
        <TouchableWrapper onPress={() => handleTouch(user.uuid)}>
          <AvatarContainer>
            <PresenceIndicator isOnline={user.status === UserStatus.Online}>
              <Avatar
                height={AVATAR_SIZE}
                width={AVATAR_SIZE}
                userAvatar={user.avatar}
              />
            </PresenceIndicator>
          </AvatarContainer>
          <Body>
            <Section>
              <Username color={user.theme_color}>{user.username}</Username>
              {selected ? <FilledCheckIcon /> : <EmptyCheckIcon />}
            </Section>
          </Body>
        </TouchableWrapper>
      </AddPersonContainer>
    )
  }
}

export const AddPersonItem = AddPersonItemComponent
