import { RequestHandler, RouterOptions } from 'express'
import { RequestHandlerParams } from 'express-serve-static-core'

const controllerMetaMap = new Map<any, ControllerMeta>()

interface Middleware {
  before?: RequestHandlerParams[]
  after?: RequestHandlerParams[]
}

export interface ControllerMeta {
  path: string
  middleware: Middleware
  routerOptions: RouterOptions
}

export function getControllerMeta(
  ControllerConstructor: any
): ControllerMeta | undefined {
  return controllerMetaMap.get(ControllerConstructor)
}

export function setControllerMeta(
  ControllerConstructor: any,
  meta: ControllerMeta
): void {
  controllerMetaMap.set(ControllerConstructor, meta)
}

export function controller(
  path: string,
  middleware: RequestHandler[] | Middleware = {},
  routerOptions: RouterOptions = {}
) {
  if (Array.isArray(middleware)) {
    middleware = {
      before: middleware
    }
  }
  return function controllerDecorator(target: any) {
    const meta: ControllerMeta = {
      path,
      middleware: middleware as Middleware,
      routerOptions
    }

    setControllerMeta(target, meta)
  }
}
