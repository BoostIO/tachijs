import express, { RequestHandler, Router } from 'express'
import {
  HttpMethodMeta,
  getControllerMeta,
  getHttpMethodMetaList,
  getHandlerParamMetaList
} from './decorators'
import { BaseController } from './BaseController'
import { BaseResult } from './results'
import { Injector } from './Injector'

export type ConfigSetter = (app: express.Application) => void

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

  return new TachiJSApp<C>(app, controllers, container, before, after).build()
}

class TachiJSApp<C> {
  private readonly injector: Injector<C>
  constructor(
    private readonly app: express.Application,
    private readonly controllers: any[],
    readonly container: any,
    private readonly before?: ConfigSetter,
    private readonly after?: ConfigSetter
  ) {
    this.injector = new Injector(container)
  }

  build() {
    const { app, before, after, controllers } = this

    if (before != null) before(app)

    controllers.map(ControllerConstructor => {
      const controllerMeta = getControllerMeta(ControllerConstructor)
      if (controllerMeta == null)
        throw new Error(
          `Please apply @controller decorator to "${
            ControllerConstructor.name
          }".`
        )
      const router = express.Router(controllerMeta.routerOptions)

      this.registerMiddlewares(router, controllerMeta.middlewares)

      this.bindControllerRoutes(router, ControllerConstructor)

      app.use(controllerMeta.path, router)
    })

    if (after != null) after(app)

    return app
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
        const controller = this.injector.instantiate(ControllerConstructor)
        if (controller instanceof BaseController) {
          controller.context = {
            req,
            res,
            inject: (key: string) => {
              return this.injector.inject(key)
            }
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
