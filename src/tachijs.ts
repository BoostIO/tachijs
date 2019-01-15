import express, { RequestHandler, Router } from 'express'
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

export type Instantiator = (Constructor: any) => any

export interface TachiJSOptions<C = {}> {
  app?: express.Application
  before?: ConfigSetter
  after?: ConfigSetter
  controllers?: any[]
  container?: C
}

export function tachijs<C>(options: TachiJSOptions<C>): express.Application {
  const {
    app = express(),
    controllers = [],
    container = {},
    before,
    after
  } = options

  return new TachiJSApp(app, controllers, container, before, after).build()
}

class TachiJSApp {
  private readonly containerMap: Map<string, any>
  constructor(
    private readonly app: express.Application,
    private readonly controllers: any[],
    readonly container: any,
    private readonly before?: ConfigSetter,
    private readonly after?: ConfigSetter
  ) {
    this.containerMap = new Map(Object.entries(container))
  }

  build() {
    const { app, before, after, controllers } = this

    if (before != null) before(app)

    controllers.map(ControllerConstructor => {
      const router = express.Router()
      const controllerMeta = getControllerMeta(ControllerConstructor)
      if (controllerMeta == null)
        throw new Error(
          `Please apply @controller decorator to "${
            ControllerConstructor.name
          }".`
        )

      this.registerMiddlewares(router, controllerMeta.middlewares)

      this.bindControllerRoutes(router, ControllerConstructor)

      app.use(controllerMeta.path, router)
    })

    if (after != null) after(app)

    return app
  }

  instantiate(Constructor: any) {
    const injectMetaList = getInjectMetaList(Constructor)
    const args = injectMetaList.map(injectMeta => {
      if (this.containerMap.get(injectMeta.key))
        return this.instantiate(this.containerMap.get(injectMeta.key))
      throw new Error(
        `The constructor for "${
          injectMeta.key
        }" is not registered in the current container.`
      )
    }) as any[]

    return new Constructor(...args)
  }

  registerMiddlewares(router: Router, middlewares: RequestHandler[]) {
    middlewares.map(middleware => router.use(middleware))
  }

  bindControllerRoutes(router: express.Router, ControllerConstructor: any) {
    const methodList = getHttpMethodMetaList(ControllerConstructor)
    methodList.map(methodMeta => {
      const handler = this.makeRequestHandler(ControllerConstructor, methodMeta)
      this.bindHandler(router, methodMeta, handler)
    })
  }

  makeRequestHandler(ControllerConstructor: any, methodMeta: HttpMethodMeta) {
    return async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      try {
        const controller = this.instantiate(ControllerConstructor)
        if (controller instanceof BaseController) {
          controller.httpContext = {
            req,
            res
          }
          controller.injector = (type: string) => {
            if (!this.containerMap.has(type))
              throw new Error(`No service is registered for "${type}" key.`)
            return this.instantiate(this.containerMap.get(type))
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
            args[paramMeta.index] = await paramMeta.selector(
              req,
              res,
              next,
              paramMeta
            )
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

  bindHandler(
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
}
