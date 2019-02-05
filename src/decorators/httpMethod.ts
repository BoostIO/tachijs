import { MetaKey } from '../consts'
import { RequestHandler } from 'express'

const metaKey = MetaKey.httpMethod

export interface HttpMethodMeta {
  method: string
  path: string
  propertyKey: string
  middlewares: RequestHandler[]
}

export type HttpMethodMetaList = HttpMethodMeta[]

export function getHttpMethodMetaList(controller: any): HttpMethodMetaList {
  const metaList = Reflect.getMetadata(metaKey, controller)
  if (metaList == null) return []
  return metaList
}

export function setHttpMethodMetaList(
  controller: any,
  meta: HttpMethodMetaList
): void {
  Reflect.defineMetadata(metaKey, meta, controller)
}

export function httpMethod(
  method: string,
  path: string,
  middlewares: RequestHandler[] = []
) {
  return function httpMethodDecorator(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const previousHttpMethodList = getHttpMethodMetaList(target.constructor)

    const newHttpMethodList = [
      ...previousHttpMethodList,
      {
        method,
        path,
        propertyKey,
        middlewares
      }
    ]

    setHttpMethodMetaList(target.constructor, newHttpMethodList)
  }
}

export function httpGet(path: string, middlewares?: RequestHandler[]) {
  return httpMethod('get', path, middlewares)
}

export function httpPost(path: string, middlewares?: RequestHandler[]) {
  return httpMethod('post', path, middlewares)
}

export function httpPut(path: string, middlewares?: RequestHandler[]) {
  return httpMethod('put', path, middlewares)
}

export function httpPatch(path: string, middlewares?: RequestHandler[]) {
  return httpMethod('patch', path, middlewares)
}

export function httpDelete(path: string, middlewares?: RequestHandler[]) {
  return httpMethod('delete', path, middlewares)
}

export function httpOptions(path: string, middlewares?: RequestHandler[]) {
  return httpMethod('options', path, middlewares)
}

export function httpHead(path: string, middlewares?: RequestHandler[]) {
  return httpMethod('head', path, middlewares)
}

export function httpAll(path: string, middlewares?: RequestHandler[]) {
  return httpMethod('all', path, middlewares)
}
