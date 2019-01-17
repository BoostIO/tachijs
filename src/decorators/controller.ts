import { MetaKey } from '../consts'
import { RequestHandler, RouterOptions } from 'express'

const metaKey = MetaKey.controller

export interface ControllerMeta {
  path: string
  middlewares: RequestHandler[]
  routerOptions: RouterOptions
}

export function getControllerMeta(
  ControllerConstructor: any
): ControllerMeta | undefined {
  return Reflect.getMetadata(metaKey, ControllerConstructor)
}

export function setControllerMeta(
  ControllerConstructor: any,
  meta: ControllerMeta
): void {
  Reflect.defineMetadata(metaKey, meta, ControllerConstructor)
}

export function controller(
  path: string,
  middlewares: RequestHandler[] = [],
  routerOptions: RouterOptions = {}
) {
  return function controllerDecorator(target: any) {
    const meta: ControllerMeta = {
      path,
      middlewares,
      routerOptions
    }

    setControllerMeta(target, meta)
  }
}
