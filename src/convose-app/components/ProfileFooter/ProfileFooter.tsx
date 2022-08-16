import React from "react"

import { color } from "convose-styles"
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons"
import { User } from "convose-lib/user"
import { Footer, FooterItemWrapper, FooterText, FooterItem } from "./styled"

type ProfileFooterProps = {
  readonly darkMode: boolean | null
  readonly user: User
  readonly changeTheme: (darkMode: boolean) => void
  readonly logOut: () => void
}

const ProfileFooterComponent: React.FunctionComponent<ProfileFooterProps> = ({
  user,
  darkMode,
  changeTheme,
  logOut,
}) => {
  return (
    <Footer>
      <FooterItemWrapper onPress={() => changeTheme(!darkMode)}>
        {darkMode ? (
          <FooterItem>
            <Ionicons color={color.yellow} name="sunny" size={28} />
            <FooterText color={color.yellow}>Light Mode</FooterText>
          </FooterItem>
        ) : (
          <FooterItem>
            <Ionicons color={color.black} name="md-moon" size={28} />
            <FooterText color={color.black}>Dark Mode</FooterText>
          </FooterItem>
        )}
      </FooterItemWrapper>
      {!user.is_guest && (
        <FooterItemWrapper onPress={() => logOut()}>
          <FooterItem>
            <SimpleLineIcons name="logout" size={24} color={color.red} />
            <FooterText color={color.red}>Logout</FooterText>
          </FooterItem>
        </FooterItemWrapper>
      )}
    </Footer>
  )
}
// ProfileFooterComponent.whyDidYouRender = {
//   logOnDifferentValues: false,
//   customName: "ProfileFooterComponent",
//   diffNameColor: "red",
// }
export const ProfileFooter = React.memo(ProfileFooterComponent)
