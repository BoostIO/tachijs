import { MetaKey } from './consts'
import express from 'express'

const metaKey = MetaKey.handlerParam

export type HandlerParamSelector = <T>(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => T

export interface HandlerParamMeta {
  index: number
  selector: HandlerParamSelector
}

export type HandlerParamListMeta = HandlerParamMeta[]

export function getHandlerParamListMeta(controller: any): HandlerParamListMeta {
  const metaList = Reflect.getMetadata(metaKey, controller)
  if (metaList == null) return []
  return metaList
}

export function setHandlerParamListMeta(
  controller: any,
  meta: HandlerParamListMeta
): void {
  Reflect.defineMetadata(metaKey, meta, controller)
}

export function handlerParam(selector: HandlerParamSelector) {
  return function controllerDecorator(
    target: any,
    propertyKey: string,
    index: number
  ) {
    let previousHandlerParamList = getHandlerParamListMeta(target.constructor)

    const meta: HandlerParamListMeta = [
      {
        index,
        selector
      },
      ...previousHandlerParamList
    ]

    setHandlerParamListMeta(target.constructor, meta)
  }
}
