import express from 'express'

const reflectMetadataIsAvailable =
  typeof (Reflect as any).getMetadata !== 'undefined'

const handlerParamMetaMap = new Map<
  any,
  Map<string, HandlerParamMeta<unknown>[]>
>()

export type HandlerParamSelector<T> = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  meta: HandlerParamMeta<T>
) => T

export interface HandlerParamMeta<T> {
  index: number
  selector: HandlerParamSelector<T>
  paramType?: any
}

export type HandlerParamMetaList = HandlerParamMeta<any>[]

export function getHandlerParamMetaList(
  controller: any,
  propertyKey: string
): HandlerParamMetaList {
  if (!handlerParamMetaMap.has(controller)) return []
  const metaList = handlerParamMetaMap.get(controller)!.get(propertyKey)
  if (metaList == null) return []
  return metaList
}

export function setHandlerParamMetaList(
  controller: any,
  propertyKey: string,
  meta: HandlerParamMetaList
): void {
  if (!handlerParamMetaMap.has(controller)) {
    handlerParamMetaMap.set(controller, new Map())
  }
  const propertyKeyMetaMap = handlerParamMetaMap.get(controller)!
  propertyKeyMetaMap.set(propertyKey, meta)
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

    const handlerParamMeta: HandlerParamMeta<T> = {
      index,
      selector
    }
    if (reflectMetadataIsAvailable) {
      handlerParamMeta.paramType = (Reflect as any).getMetadata(
        'design:paramtypes',
        target,
        propertyKey
      )[index]
    }

    const meta: HandlerParamMetaList = [
      ...previousHandlerParamList,
      handlerParamMeta
    ]

    setHandlerParamMetaList(target.constructor, propertyKey, meta)
  }
}
