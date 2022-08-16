import * as React from "react"
import * as renderer from "react-test-renderer"
import { noop } from "rxjs"

import { Slice } from "convose-lib/interests"
import { KnowledgeLevelSelector } from "../KnowledgeLevelSelector"

describe("KnowledgeLevelSelector", () => {
  const slice: Slice = {
    active: true,
    end: Math.PI,
    start: 0,
  }

  it("renders without crashing", () => {
    const rendered: renderer.ReactTestRendererJSON | null = renderer
      .create(
        <KnowledgeLevelSelector
          index={1}
          radius={2}
          slice={slice}
          changeLevel={noop}
        />
      )
      .toJSON()
    expect(rendered).toBeTruthy()
  })
})
