// eslint-disable-next-line import/no-extraneous-dependencies
import { map } from "rxjs/operators"

import { AuthToken } from "convose-lib/user"
import { get } from "../api"
import { Interest } from "./dto"
import { DEFAULT_FROM, LIMIT_OF_INTERESTS } from "./actions"

interface IAutocomplete<T> {
  readonly autocomplete: T
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const searchInterests = (
  Authorization: AuthToken,
  text: string,
  limit = LIMIT_OF_INTERESTS,
  from = DEFAULT_FROM
) =>
  get<IAutocomplete<ReadonlyArray<Interest>>>(
    `autocomplete/interests?q=${text}&limit=${limit}&from=${from}`,
    { Authorization, withCredentials: true }
  ).pipe(map((interests) => interests.autocomplete || []))
