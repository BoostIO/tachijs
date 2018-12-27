import { MetaKey } from './consts'
import express from 'express'

const metaKey = MetaKey.handlerParam

export type HandlerParamSelector<T> = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => T

export interface HandlerParamMeta<T> {
  index: number
  selector: HandlerParamSelector<T>
}

export type HandlerParamMetaList = HandlerParamMeta<any>[]

export function getHandlerParamMetaList(controller: any): HandlerParamMetaList {
  const metaList = Reflect.getMetadata(metaKey, controller)
  if (metaList == null) return []
  return metaList
}

export function setHandlerParamMetaList(
  controller: any,
  meta: HandlerParamMetaList
): void {
  Reflect.defineMetadata(metaKey, meta, controller)
}

export function handlerParam<T>(selector: HandlerParamSelector<T>) {
  return function controllerDecorator(
    target: any,
    propertyKey: string,
    index: number
  ) {
    let previousHandlerParamList = getHandlerParamMetaList(target.constructor)

    const meta: HandlerParamMetaList = [
      {
        index,
        selector
      },
      ...previousHandlerParamList
    ]

    setHandlerParamMetaList(target.constructor, meta)
  }
}

export function reqParams(paramName?: string) {
  const selector: HandlerParamSelector<any> =
    paramName == null ? req => req.params : req => req.params[paramName]
  return handlerParam(selector)
}

export function reqBody() {
  return handlerParam(req => req.body)
}

export function reqQuery(paramName?: string) {
  const selector: HandlerParamSelector<any> =
    paramName == null ? req => req.query : req => req.query[paramName]
  return handlerParam(selector)
}

export function reqHeaders(paramName?: string) {
  const selector: HandlerParamSelector<any> =
    paramName == null ? req => req.headers : req => req.headers[paramName]
  return handlerParam(selector)
}

export function reqCookies(paramName?: string) {
  const selector: HandlerParamSelector<any> =
    paramName == null ? req => req.cookies : req => req.cookies[paramName]
  return handlerParam(selector)
}

export function resRender() {
  return handlerParam((req, res) => res.render)
}

export function nextFn() {
  return handlerParam((req, res, next) => next)
}
