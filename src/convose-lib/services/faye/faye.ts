import faye from "faye"
import { FAYE_CONFIG, FAYE_OPTIONS } from "./faye-config"

export let fayeClient: any //tslint:disable-line

export const initializeFaye = () => {
  if (!fayeClient) {
    fayeClient = new faye.Client(FAYE_CONFIG.production.url, FAYE_OPTIONS) //tslint:disable-line
    fayeClient.disable("autodisconnect")

    fayeClient.on("transport:down", () => {
      // the client is offline
      // console.log('Faye is Down', new Date(Date.now()))
    })

    fayeClient.on("transport:up", () => {
      // the client is online
      // console.log('Faye is Up', new Date(Date.now()))
    })
  }
}

export const getClient = () => {
  if (!fayeClient) {
    initializeFaye()
  }

  return fayeClient
}
