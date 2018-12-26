import { MetaKey } from './consts'

const metaKey = MetaKey.httpMethods

export interface HttpMethodMeta {
  method: string
  path: string
  propertyKey: string
}

export type HttpMethodListMeta = HttpMethodMeta[]

export function getHttpMethodListMeta(controller: any): HttpMethodListMeta {
  const metaList = Reflect.getMetadata(metaKey, controller)
  if (metaList == null) return []
  return metaList
}

export function setHttpMethodListMeta(
  controller: any,
  meta: HttpMethodListMeta
): void {
  Reflect.defineMetadata(metaKey, meta, controller)
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

export function httpGet(path: string) {
  return httpMethod('get', path)
}

export function httpPost(path: string) {
  return httpMethod('post', path)
}

export function httpPut(path: string) {
  return httpMethod('put', path)
}

export function httpPatch(path: string) {
  return httpMethod('patch', path)
}

export function httpDelete(path: string) {
  return httpMethod('delete', path)
}

export function httpOptions(path: string) {
  return httpMethod('options', path)
}

export function httpHead(path: string) {
  return httpMethod('head', path)
}

export function httpAll(path: string) {
  return httpMethod('all', path)
}
