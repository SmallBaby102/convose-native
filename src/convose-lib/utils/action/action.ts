// See: https://medium.com/@martin_hotell/improved-redux-type-safety-with-typescript-2-8-2c11a8062575

interface IAction<T extends string> {
  readonly type: T
}

interface IActionWithPayload<T extends string, P> extends IAction<T> {
  readonly payload: P
}

export function createAction<T extends string>(type: T): IAction<T>
export function createAction<T extends string, P>(
  type: T,
  payload: P
): IActionWithPayload<T, P>
export function createAction<T extends string, P>(
  type: T,
  payload?: P
): IAction<T> | IActionWithPayload<T, P> {
  return payload === undefined ? { type } : { type, payload }
}

type FunctionType = (...args: any[]) => any
type ActionCreatorsMapObject = {
  readonly [actionCreator: string]: FunctionType
}
export type ActionsUnion<A extends ActionCreatorsMapObject> = ReturnType<
  A[keyof A]
>
