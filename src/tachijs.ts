import express from 'express'
import {
  HttpMethodMeta,
  getControllerMeta,
  getHttpMethodMetaList,
  getHandlerParamMetaList,
  getInjectMetaList
} from './decorators'
import { BaseResult } from './results'

export type ConfigSetter = (app: express.Application) => void

export interface TachiJSOptions<C = {}> {
  before?: ConfigSetter
  after?: ConfigSetter
  controllers?: any[]
  container?: C
}

export function tachijs<C>(options: TachiJSOptions<C>): express.Application {
  const app = express()
  const { controllers = [], container = {}, before, after } = options

  if (before != null) before(app)

  controllers
    .map(instantiateWithContainer(container))
    .map(registerControllerToApp(app))

  if (after != null) after(app)

  return app
}

function instantiateWithContainer(container: any) {
  const constructorMap = new Map(Object.entries(container))
  return function instantiate(Constructor: any) {
    const injectMetaList = getInjectMetaList(Constructor)
    const args = injectMetaList.map(injectMeta =>
      instantiate(constructorMap.get(injectMeta.key))
    ) as any[]

    return new Constructor(...args)
  }
}

function registerControllerToApp(app: express.Application) {
  return (controller: any) => {
    const router = express.Router()
    const ControllerConstructor = controller.constructor
    const controllerMeta = getControllerMeta(ControllerConstructor)
    if (controllerMeta == null)
      throw new Error(
        `Please apply @controller decorator to "${ControllerConstructor.name}".`
      )
    const methodList = getHttpMethodMetaList(ControllerConstructor)
    methodList.map(methodMeta => {
      const handler = makeRequestHandler(controller, methodMeta)
      bindHandler(router, methodMeta, handler)
    })

    app.use(controllerMeta.path, router)
  }
}

function bindHandler(
  router: express.Router,
  methodMeta: HttpMethodMeta,
  handler: express.RequestHandler
) {
  switch (methodMeta.method) {
    case 'get':
      router.get(methodMeta.path, handler)
      break
    case 'post':
      router.post(methodMeta.path, handler)
      break
    case 'put':
      router.put(methodMeta.path, handler)
      break
    case 'patch':
      router.patch(methodMeta.path, handler)
      break
    case 'delete':
      router.delete(methodMeta.path, handler)
      break
    case 'options':
      router.options(methodMeta.path, handler)
      break
    case 'head':
      router.head(methodMeta.path, handler)
      break
    case 'all':
      router.all(methodMeta.path, handler)
      break
    default:
      throw new Error(`"${methodMeta.method}" is not a valid method.`)
  }
}

function makeRequestHandler(controller: any, methodMeta: HttpMethodMeta) {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const method = controller[methodMeta.propertyKey]
      const paramMetaList = getHandlerParamMetaList(
        controller.constructor,
        methodMeta.propertyKey
      )
      const args = paramMetaList.reduce(
        (acc, paramMeta) => {
          acc[paramMeta.index] = paramMeta.selector(req, res, next)
          return acc
        },
        [] as any[]
      )

      const result = await method.bind(controller)(...args)
      if (result instanceof BaseResult) {
        await result.execute(req, res, next)
        return
      }
      res.send(result)
      return
    } catch (error) {
      next(error)
      return
    }
  }
}
