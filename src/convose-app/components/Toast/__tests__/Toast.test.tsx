import * as React from "react"
import * as renderer from "react-test-renderer"

import { ToastType } from "convose-lib/toast"
import { Toast } from "../Toast"

describe("toast", () => {
  it("renders without crashing", () => {
    const rendered: renderer.ReactTestRendererJSON | null = renderer
      .create(<Toast type={ToastType.error} message="Test message" />)
      .toJSON()

    expect(rendered).toBeTruthy()
  })
})
