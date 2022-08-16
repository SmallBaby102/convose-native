import * as React from "react"
import * as renderer from "react-test-renderer"
import { noop } from "rxjs"

import { InterestType } from "convose-lib/interests"
import { KnowledgeLevelWidget } from "../KnowledgeLevelWidget"

describe("KnowledgeLevelWidget", () => {
  it("renders without crashing", () => {
    const interests = {
      level: 4,
      name: "Baking",
      type: InterestType.General,
    }
    const rendered: renderer.ReactTestRendererJSON | null = renderer
      .create(<KnowledgeLevelWidget interest={interests} onChange={noop} />)
      .toJSON()
    expect(rendered).toBeTruthy()
  })
})
