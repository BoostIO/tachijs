import { getInjectMetaList } from './decorators'

export class Injector<C> {
  private readonly containerMap: Map<string, any>
  constructor(container: C) {
    this.containerMap = new Map(Object.entries(container))
  }

  instantiate(Constructor: any): any {
    const injectMetaList = getInjectMetaList(Constructor)
    const args = injectMetaList.map(injectMeta => {
      try {
        return this.inject(injectMeta.key)
      } catch (error) {
        throw new Error(
          `${error.message} (While instantiating "${Constructor.name}")`
        )
      }
    })

    return new Constructor(...args)
  }

  inject<S = any>(key: string): S {
    if (!this.containerMap.has(key))
      throw new Error(`No service is registered for "${key}" key.`)
    return this.instantiate(this.containerMap.get(key))
  }
}
