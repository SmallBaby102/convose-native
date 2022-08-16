export const FAYE_CONFIG = {
  development: {
    retries: 5,
    timeout: 120,
    url: "https://convose-chat.herokuapp.com/faye",
  },
  production: {
    retries: 5,
    timeout: 120,
    url: "https://convose-chat.herokuapp.com/faye",
  },
  staging: {
    retries: 5,
    timeout: 120,
    url: "https://convose-chat.herokuapp.com/faye",
  },
}

export const FAYE_OPTIONS = {
  retry: 5,
  timeout: 120,
}
