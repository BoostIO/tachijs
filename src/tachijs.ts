import express, { RequestHandler } from 'express'
import {
  HttpMethodMeta,
  getControllerMeta,
  getHttpMethodMetaList,
  getHandlerParamMetaList,
  getInjectMetaList
} from './decorators'
import { BaseController } from './BaseController'
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

  controllers.map(registerControllerToApp(app, container))

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

function registerControllerToApp(app: express.Application, container: any) {
  return (ControllerConstructor: any) => {
    const router = express.Router()
    const controllerMeta = getControllerMeta(ControllerConstructor)
    if (controllerMeta == null)
      throw new Error(
        `Please apply @controller decorator to "${ControllerConstructor.name}".`
      )

    bindMiddlewares(router, controllerMeta.middlewares)
    bindControllerRoutes(router, ControllerConstructor, container)

    app.use(controllerMeta.path, router)
  }
}

function bindMiddlewares(
  router: express.Router,
  middlewares: RequestHandler[]
) {
  middlewares.map(middleware => {
    router.use(middleware)
  })
}

function bindControllerRoutes(
  router: express.Router,
  ControllerConstructor: any,
  container: any
) {
  const methodList = getHttpMethodMetaList(ControllerConstructor)
  methodList.map(methodMeta => {
    const handler = makeRequestHandler(
      ControllerConstructor,
      methodMeta,
      container
    )
    bindHandler(router, methodMeta, handler)
  })
}

function bindHandler(
  router: express.Router,
  methodMeta: HttpMethodMeta,
  handler: express.RequestHandler
) {
  switch (methodMeta.method) {
    case 'get':
      router.get(methodMeta.path, ...methodMeta.middlewares, handler)
      break
    case 'post':
      router.post(methodMeta.path, ...methodMeta.middlewares, handler)
      break
    case 'put':
      router.put(methodMeta.path, ...methodMeta.middlewares, handler)
      break
    case 'patch':
      router.patch(methodMeta.path, ...methodMeta.middlewares, handler)
      break
    case 'delete':
      router.delete(methodMeta.path, ...methodMeta.middlewares, handler)
      break
    case 'options':
      router.options(methodMeta.path, ...methodMeta.middlewares, handler)
      break
    case 'head':
      router.head(methodMeta.path, ...methodMeta.middlewares, handler)
      break
    case 'all':
      router.all(methodMeta.path, ...methodMeta.middlewares, handler)
      break
    default:
      throw new Error(`"${methodMeta.method}" is not a valid method.`)
  }
}

function makeRequestHandler(
  ControllerConstructor: any,
  methodMeta: HttpMethodMeta,
  container: any
) {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const controller = instantiateWithContainer(container)(
        ControllerConstructor
      )
      if (controller instanceof BaseController) {
        controller.httpContext = {
          req,
          res
        }
      }
      const method = controller[methodMeta.propertyKey]
      const paramMetaList = getHandlerParamMetaList(
        controller.constructor,
        methodMeta.propertyKey
      )

      const args: any[] = []
      await Promise.all(
        paramMetaList.map(async paramMeta => {
          args[paramMeta.index] = await paramMeta.selector(req, res, next)
        })
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
