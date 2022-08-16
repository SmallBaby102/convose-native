export type ErrorsType = {
  readonly email: ReadonlyArray<string>
  readonly password: ReadonlyArray<string>
}

export enum AuthType {
  EMAIL = "EMAIL",
  FACEBOOK = "FACEBOOK",
  APPLE = "APPLE",
}
