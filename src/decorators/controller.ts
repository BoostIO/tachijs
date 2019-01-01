import { MetaKey } from '../consts'

const metaKey = MetaKey.controller

export interface ControllerMeta {
  path: string
}

export function getControllerMeta(controller: any): ControllerMeta | undefined {
  return Reflect.getMetadata(metaKey, controller)
}

export function setControllerMeta(controller: any, meta: ControllerMeta): void {
  Reflect.defineMetadata(metaKey, meta, controller)
}

export function controller(path: string) {
  return function controllerDecorator(target: any) {
    const meta: ControllerMeta = {
      path
    }

    setControllerMeta(target, meta)
  }
}
