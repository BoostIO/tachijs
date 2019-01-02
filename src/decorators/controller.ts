import { MetaKey } from '../consts'
import { RequestHandler } from 'express'

const metaKey = MetaKey.controller

export interface ControllerMeta {
  path: string
  middlewares: RequestHandler[]
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

export function controller(path: string, middlewares: RequestHandler[] = []) {
  return function controllerDecorator(target: any) {
    const meta: ControllerMeta = {
      path,
      middlewares
    }

    setControllerMeta(target, meta)
  }
}
