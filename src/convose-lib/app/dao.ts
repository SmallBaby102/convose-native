import { initializeFayeClient } from "convose-lib/chat"
import { initializeAmplitude } from "convose-lib/services"
import { initializeCallingEngine } from "convose-lib/services/agora"
import { setAudioMode } from "convose-lib/utils"

export const initApis = async (setFayeIsReady: () => void): Promise<void> => {
  initializeFayeClient(setFayeIsReady)
  initializeAmplitude()
  setAudioMode()
  await initializeCallingEngine()
}
