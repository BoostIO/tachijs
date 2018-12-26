import { MetaKey } from './consts'

export interface ControllerMeta {
  path: string
}

export function getControllerMeta(controller: any): ControllerMeta | undefined {
  return Reflect.getMetadata(MetaKey.controller, controller)
}

export function setControllerMeta(controller: any, meta: ControllerMeta): void {
  Reflect.defineMetadata(MetaKey.controller, meta, controller)
}

export function controller(path: string) {
  return function controllerDecorator(target: any) {
    const meta: ControllerMeta = {
      path
    }

    setControllerMeta(target, meta)
  }
}
