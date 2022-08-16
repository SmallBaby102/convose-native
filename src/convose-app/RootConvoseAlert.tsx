import { ConvoseAlert } from "./components"

// eslint-disable-next-line import/no-mutable-exports
export let convoseAlertRef: ConvoseAlert | null = null

export const createConvoseAlertRef = (ref: ConvoseAlert): void => {
  convoseAlertRef = ref
}
