import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { TouchableHighlight, FlatList } from "react-native"
import { AVATAR_SIZE_SML, defaultShadows } from "convose-styles"
import { ThemeContext } from "styled-components"
import { MENTION_EVERYONE_ID } from "convose-lib/utils"
import { searchParticipants } from "convose-lib/users-list"
import { State } from "convose-lib"
import { useSelector } from "react-redux"
import {
  SearcherWrapper,
  SearchIcon,
  SearchRow,
  SearchText,
  SearchWord,
} from "./Styled"
import { Avatar } from "../Avatar"
import { MentionSuggestionsProps } from "../../../../self-maintained-packages/react-native-controlled-mentions"

export const RenderSuggestions: FunctionComponent<MentionSuggestionsProps> = ({
  keyword,
  onSuggestionPress,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const theme: any = useContext(ThemeContext)

  const [searchResult, setSearchResult] = useState([
    { name: "Everyone", id: MENTION_EVERYONE_ID },
  ])
  // Todo: when fetching search endpoint, we can add a spinner
  const [isLoading, setIsloading] = useState(false)
  const token = useSelector((state: State) => state.user.authentication_token)
  const chatChannel = useSelector((state: State) => state.chat.openChat)

  const searchMention = useCallback(async () => {
    if (keyword && chatChannel) {
      setIsloading(true)
      const searchReturn = await searchParticipants(
        token,
        chatChannel,
        keyword
      ).toPromise()
      if (searchReturn) {
        const ret = searchReturn.map((r) => {
          return { ...r, name: r.username, id: r.uuid }
        })
        setSearchResult([...ret, { name: "Everyone", id: MENTION_EVERYONE_ID }])
      }
    }
  }, [chatChannel, keyword, token])

  useEffect(() => {
    searchMention()
  }, [searchMention])
  if (!keyword) {
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderItem = (item: any) => {
    return (
      <TouchableHighlight
        onPress={() => onSuggestionPress(item)}
        underlayColor={theme.ButtonOnPress}
      >
        <SearchRow>
          <SearchIcon>
            <Avatar
              height={AVATAR_SIZE_SML}
              width={AVATAR_SIZE_SML}
              userAvatar={item.avatar}
            />
          </SearchIcon>
          <SearchWord>
            <SearchText numberOfLines={1} color={item.theme_color}>
              {item.name}
            </SearchText>
          </SearchWord>
        </SearchRow>
      </TouchableHighlight>
    )
  }
  return (
    <SearcherWrapper style={defaultShadows}>
      <FlatList
        keyboardShouldPersistTaps="handled"
        data={searchResult}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => renderItem(item)}
      />
    </SearcherWrapper>
  )
}
