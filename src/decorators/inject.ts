const injectMetaMap = new Map<any, InjectMetaList>()

export interface InjectMeta {
  index: number
  key: string
}

export type InjectMetaList = InjectMeta[]

export function getInjectMetaList(controller: any): InjectMetaList {
  const metaList = injectMetaMap.get(controller)
  if (metaList == null) return []
  return metaList
}

export function setInjectMetaList(controller: any, meta: InjectMetaList): void {
  injectMetaMap.set(controller, meta)
}

export function inject(key: string) {
  return function controllerDecorator(
    target: any,
    propertyKey: string,
    index: number
  ) {
    const previousInjectMetaList = getInjectMetaList(target)

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
