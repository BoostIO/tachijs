import { MetaKey } from '../consts'

const metaKey = MetaKey.controller

export interface ControllerMeta {
  path: string
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

export function controller(path: string) {
  return function controllerDecorator(target: any) {
    const meta: ControllerMeta = {
      path
    }

    setControllerMeta(target, meta)
  }
}
