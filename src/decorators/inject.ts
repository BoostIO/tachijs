import { MetaKey } from '../consts'

const metaKey = MetaKey.inject

export interface InjectMeta {
  index: number
  key: string
}

export type InjectMetaList = InjectMeta[]

export function getInjectMetaList(controller: any): InjectMetaList {
  const metaList = Reflect.getMetadata(metaKey, controller)
  if (metaList == null) return []
  return metaList
}

export function setInjectMetaList(controller: any, meta: InjectMetaList): void {
  Reflect.defineMetadata(metaKey, meta, controller)
}

export function inject(key: string) {
  return function controllerDecorator(
    target: any,
    propertyKey: string,
    index: number
  ) {
    let previousInjectMetaList = getInjectMetaList(target)

    const meta: InjectMetaList = [
      {
        index,
        key
      },
      ...previousInjectMetaList
    ]

    setInjectMetaList(target, meta)
  }
}
