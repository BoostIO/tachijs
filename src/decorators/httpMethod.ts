import { RequestHandlerParams } from 'express-serve-static-core'

const httpMethodMetaMap = new Map<any, HttpMethodMetaList>()

interface MiddlewareParams {
  before?: RequestHandlerParams[]
  after?: RequestHandlerParams[]
}

export interface HttpMethodMeta {
  method: string
  path: string
  propertyKey: string
  middleware: MiddlewareParams
}

export type HttpMethodMetaList = HttpMethodMeta[]

export function getHttpMethodMetaList(controller: any): HttpMethodMetaList {
  const metaList = httpMethodMetaMap.get(controller)
  if (metaList == null) return []
  return metaList
}

export function setHttpMethodMetaList(
  controller: any,
  meta: HttpMethodMetaList
): void {
  httpMethodMetaMap.set(controller, meta)
}

export function httpMethod(
  method: string,
  path: string,
  middleware: RequestHandlerParams[] | MiddlewareParams = {}
) {
  if (Array.isArray(middleware)) {
    middleware = {
      before: middleware
    }
  }

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
        middleware: middleware as MiddlewareParams
      }
    ]

    setHttpMethodMetaList(target.constructor, newHttpMethodList)
  }
}

export function httpGet(
  path: string,
  middlewares?: RequestHandlerParams[] | MiddlewareParams
) {
  return httpMethod('get', path, middlewares)
}

export function httpPost(
  path: string,
  middlewares?: RequestHandlerParams[] | MiddlewareParams
) {
  return httpMethod('post', path, middlewares)
}

export function httpPut(
  path: string,
  middlewares?: RequestHandlerParams[] | MiddlewareParams
) {
  return httpMethod('put', path, middlewares)
}

export function httpPatch(
  path: string,
  middlewares?: RequestHandlerParams[] | MiddlewareParams
) {
  return httpMethod('patch', path, middlewares)
}

export function httpDelete(
  path: string,
  middlewares?: RequestHandlerParams[] | MiddlewareParams
) {
  return httpMethod('delete', path, middlewares)
}

export function httpOptions(
  path: string,
  middlewares?: RequestHandlerParams[] | MiddlewareParams
) {
  return httpMethod('options', path, middlewares)
}

export function httpHead(
  path: string,
  middlewares?: RequestHandlerParams[] | MiddlewareParams
) {
  return httpMethod('head', path, middlewares)
}

export function httpAll(
  path: string,
  middlewares?: RequestHandlerParams[] | MiddlewareParams
) {
  return httpMethod('all', path, middlewares)
}
