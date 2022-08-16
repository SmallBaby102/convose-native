export interface IHeaders {
  readonly [key: string]: string | boolean
}

export const prefixedUrl = (url: string): string =>
  // `http://0.0.0.0:3000/${url}`
  `https://api.convose.com/${url}`

export const mergeToDefaultHeaders = (headers?: IHeaders): IHeaders => ({
  Accept: "application/json",
  // TODO: Authorization: getAuthorization(),
  ...headers,
})

export const mergeToHeadersForPayloads = (headers?: IHeaders): IHeaders =>
  mergeToDefaultHeaders({
    "Content-Type": "application/json;charset=UTF-8",
    ...headers,
  })
