import { MetaKey } from '../../consts'
import express from 'express'

const metaKey = MetaKey.handlerParam

export type HandlerParamSelector<T> = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  meta: HandlerParamMeta<T>
) => T

export interface HandlerParamMeta<T> {
  index: number
  selector: HandlerParamSelector<T>
  paramType: any
}

export type HandlerParamMetaList = HandlerParamMeta<any>[]

export function getHandlerParamMetaList(
  controller: any,
  propertyKey: string
): HandlerParamMetaList {
  const metaList = Reflect.getMetadata(metaKey, controller, propertyKey)
  if (metaList == null) return []
  return metaList
}

export function setHandlerParamMetaList(
  controller: any,
  meta: HandlerParamMetaList,
  propertyKey: string
): void {
  Reflect.defineMetadata(metaKey, meta, controller, propertyKey)
}

export function handlerParam<T>(selector: HandlerParamSelector<T>) {
  return function controllerDecorator(
    target: any,
    propertyKey: string,
    index: number
  ) {
    const previousHandlerParamList = getHandlerParamMetaList(
      target.constructor,
      propertyKey
    )

    const meta: HandlerParamMetaList = [
      {
        index,
        selector,
        paramType: Reflect.getMetadata(
          'design:paramtypes',
          target,
          propertyKey
        )[index]
      },
      ...previousHandlerParamList
    ]

    setHandlerParamMetaList(target.constructor, meta, propertyKey)
  }
}
