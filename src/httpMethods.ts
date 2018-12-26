import { MetaKey } from './consts'

export interface HttpMethodMeta {
  method: string
  path: string
  propertyKey: string
}

export type HttpMethodListMeta = HttpMethodMeta[]

export function getHttpMethodListMeta(controller: any): HttpMethodListMeta {
  const metaList = Reflect.getMetadata(MetaKey.httpMethods, controller)
  if (metaList == null) return []
  return metaList
}

export function setHttpMethodListMeta(
  controller: any,
  meta: HttpMethodListMeta
): void {
  Reflect.defineMetadata(MetaKey.httpMethods, meta, controller)
}

export function httpMethod(method: string, path: string) {
  return function httpMethodDecorator(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    let previousHttpMethodList = getHttpMethodListMeta(target.constructor)
    if (previousHttpMethodList == null) previousHttpMethodList = []

    const newHttpMethodList = [
      {
        method,
        path,
        propertyKey
      },
      ...previousHttpMethodList
    ]

    setHttpMethodListMeta(target.constructor, newHttpMethodList)
  }
}
