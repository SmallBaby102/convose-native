import { Props } from "convose-styles"
import styled from "styled-components/native"

type PartialProps = Partial<Props>
type KnowledgeLevelType = PartialProps & { active: boolean }

export const KnowledgeLevelContainer = styled.View`
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 30px;
  width: 55px;
`
export const KnowledgeLevelBubble = styled.View`
  width: ${(props: KnowledgeLevelType) => (props.active ? 45 : 40)}px;
  height: ${(props: KnowledgeLevelType) => (props.active ? 45 : 40)}px;
  margin-horizontal: ${(props: KnowledgeLevelType) =>
    props.active ? 0 : 2.5}px;
  background-color: ${(props: KnowledgeLevelType) =>
    props.active
      ? props.theme.interests.linearRating.active
      : props.theme.interests.linearRating.inactive};
  border-radius: 45;
`
export const KnowledgeLevelTitleContainer = styled.View`
  width: 150px;
  position: absolute;
  top: ${(props: KnowledgeLevelType) => (props.active ? 47.5 : 45)}px;
  /* top: 50px; */
  left: 20px;
`
export const KnowledgeLevelTitle = styled.Text`
  font-family: ${(props: KnowledgeLevelType) =>
    props.active ? "Popins-extra-bold" : "Popins-bold"};
  color: ${(props: PartialProps) => props.theme.main.text};
  font-weight: 500;
  include-font-padding: false;
  text-align-vertical: center;
`
export const KnowledgeContainer = styled.View`
  flex-direction: row;
  padding-right: 20px;
  padding-left: 31px;
  margin-top: 20px;
  margin-bottom: 90px;
  align-items: center;
`
