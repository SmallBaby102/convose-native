import { createAction } from "../"

describe("createAction", () => {
  it("should create simple action object if payload is not given", () => {
    const expectedAction = {
      type: "TEST_ACTION",
    }
    const actualAction = createAction("TEST_ACTION")

    expect(actualAction).toEqual(expectedAction)
  })

  it("should create simple action object if payload is given", () => {
    const expectedAction = {
      payload: "example-payload",
      type: "TEST_ACTION",
    }

    expect(createAction("TEST_ACTION", "example-payload")).toEqual(
      expectedAction
    )
  })
})
