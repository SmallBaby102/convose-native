import { AjaxError } from "rxjs/ajax"

// tslint:disable
export const setAuthError = (Error: AjaxError): string => {
  const message =
    Error && Error.response && Error.response.error
      ? Error.response.error
      : "Something wrong"
  if (message === "param is missing or the value is empty: email") {
    return "Please enter your email"
  }
  if (message === "param is missing or the value is empty: password") {
    return "Please enter your password"
  }
  if (message === "Validation failed: Email is invalid") {
    return "Invalid Email"
  }
  if (
    message ===
    "Validation failed: Password is too short (minimum is 8 characters)"
  ) {
    return "Password is too short (minimum is 8 characters)"
  }
  if (message === "Validation failed: Email has already been taken") {
    return "Email has already been taken"
  }
  return message
}
