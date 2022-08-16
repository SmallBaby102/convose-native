import * as React from "react"
import { Text } from "react-native"
import * as renderer from "react-test-renderer"
import { noop } from "rxjs"

import { Interest } from "convose-lib/interests"
import { AutosuggestOption } from "../../AutosuggestOption"
import { AutosuggestOptionList } from "../AutosuggestOptionList"

jest.mock("../../AutosuggestOption", () => {
  const { Text } = require("react-native") 

  return {
    AutosuggestOption: jest.fn(() => <Text>Option</Text>),
    StyledOptionView: jest.fn((props) => <Text>{props.children}</Text>),
  }
})

describe("AutosuggestOptionList", () => {
  it("should render info, if result array is empty", () => {
    const rendered: renderer.ReactTestInstance = renderer.create(
      <AutosuggestOptionList results={[]} onSelect={noop} />
    ).root

    expect(rendered.findByType(Text).props.children.props.children).toEqual(
      "No results..."
    )
  })

  it("should render as many Option components as given results", () => {
    const results = [
      { name: "Test", match: 20, type: "general" },
      { name: "Test2", match: 21, type: "general" },
      { name: "Test3", match: 22, type: "general" },
    ] as ReadonlyArray<Interest>

    const rendered: renderer.ReactTestInstance = renderer.create(
      <AutosuggestOptionList results={results} onSelect={noop} />
    ).root

    const renderedOptions = rendered.findAllByType(AutosuggestOption)

    expect(renderedOptions).toHaveLength(results.length)
  })
})
