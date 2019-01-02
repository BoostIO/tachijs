import { HandlerParamSelector, handlerParam } from './handlerParam'
import express from 'express'

export function reqCookies(paramName?: string) {
  const selector: HandlerParamSelector<any> =
    paramName == null ? req => req.cookies : req => req.cookies[paramName]
  return handlerParam(selector)
}

export interface CookieSetter {
  (name: string, val: string, options: express.CookieOptions): express.Response
  (name: string, val: any, options: express.CookieOptions): express.Response
  (name: string, val: any): express.Response
}

export function setCookie() {
  return handlerParam((req, res) => res.cookie.bind(res))
}

export type CookieClearer = (name: string, options?: any) => express.Response

export function clearCookie() {
  return handlerParam((req, res) => res.clearCookie.bind(res))
}

export function reqSignedCookies(paramName?: string) {
  const selector: HandlerParamSelector<any> =
    paramName == null
      ? req => req.signedCookies
      : req => req.signedCookies[paramName]
  return handlerParam(selector)
}
