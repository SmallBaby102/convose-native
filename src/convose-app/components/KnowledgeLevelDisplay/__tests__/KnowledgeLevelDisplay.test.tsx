import * as React from "react"
import * as renderer from "react-test-renderer"
import { noop } from "rxjs"

import { RatingLevel } from "convose-lib/interests"
import { KnowledgeLevelDisplay } from "../KnowledgeLevelDisplay"

describe("KnowledgeLevelDisplay", () => {
  it("renders without crashing", () => {
    const rendered: renderer.ReactTestRendererJSON | null = renderer
      .create(
        <KnowledgeLevelDisplay
          level={RatingLevel.Intermediate}
          width={100}
          changeLevel={noop}
        />
      )
      .toJSON()
    expect(rendered).toBeTruthy()
  })
})
