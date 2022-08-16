/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import { Observable } from "rxjs"
import { ajax, AjaxResponse } from "rxjs/ajax"
import { map } from "rxjs/operators"

import {
  IHeaders,
  mergeToDefaultHeaders,
  mergeToHeadersForPayloads,
  prefixedUrl,
} from "./utils"

const toResponse = <T>() => map<AjaxResponse, T>(({ response }) => response)

export const _get = <T>(url: string, headers?: IHeaders): Observable<T> =>
  ajax.get(url, mergeToDefaultHeaders(headers)).pipe(toResponse<T>())

export const _patch = <T, U>(
  url: string,
  body: U,
  headers?: IHeaders
): Observable<T> =>
  ajax
    .patch(url, body, mergeToHeadersForPayloads(headers))
    .pipe(toResponse<T>())

export const _post = <T, U>(
  url: string,
  body: U,
  headers?: IHeaders
): Observable<T> =>
  ajax.post(url, body, mergeToHeadersForPayloads(headers)).pipe(toResponse<T>())

export const _delete = <T, U>(url: string, headers?: IHeaders): Observable<T> =>
  ajax
    .delete(prefixedUrl(url), mergeToHeadersForPayloads(headers))
    .pipe(toResponse<T>())

export const get = <T>(url: string, headers?: IHeaders): Observable<T> =>
  _get(prefixedUrl(url), headers)

export const patch = <T, U>(
  url: string,
  body: U,
  headers?: IHeaders
): Observable<T> => _patch(prefixedUrl(url), body, headers)

export const post = <T, U>(
  url: string,
  body?: U,
  headers?: IHeaders
): Observable<T> => _post(prefixedUrl(url), body, headers)

export const post$ = <T, U>(
  url: string,
  body: U,
  headers?: IHeaders
): Observable<T> =>
  ajax.post(prefixedUrl(url), body, headers).pipe(toResponse<T>())
