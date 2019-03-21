import { RequestHandler, RouterOptions } from 'express'

const controllerMetaMap = new Map<any, ControllerMeta>()

export interface ControllerMeta {
  path: string
  middlewares: RequestHandler[]
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
