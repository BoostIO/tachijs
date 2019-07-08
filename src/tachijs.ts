import express from 'express'
import {
  HttpMethodMeta,
  ControllerMeta,
  getControllerMeta,
  getHttpMethodMetaList,
  getHandlerParamMetaList
} from './decorators'
import { BaseController } from './BaseController'
import { BaseResult } from './results'
import { Injector } from './Injector'
import { RequestHandlerParams } from 'express-serve-static-core'

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
          `Please apply @controller decorator to "${ControllerConstructor.name}".`
        )
      const router = express.Router(controllerMeta.routerOptions)

      this.bindControllerRoutes(router, ControllerConstructor, controllerMeta)

      app.use(controllerMeta.path, router)
    })

    if (after != null) after(app)

    return app
  }

  bindControllerRoutes(
    router: express.Router,
    ControllerConstructor: any,
    controllerMeta: ControllerMeta
  ) {
    const methodList = getHttpMethodMetaList(ControllerConstructor)
    methodList.map(methodMeta => {
      const handler = this.makeRequestHandler(ControllerConstructor, methodMeta)
      this.bindHandler(router, controllerMeta, methodMeta, handler)
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
        if (!res.finished) {
          res.send(result)
        }
        return
      } catch (error) {
        next(error)
        return
      }
    }
  }

  bindHandler(
    router: express.Router,
    controllerMeta: ControllerMeta,
    methodMeta: HttpMethodMeta,
    handler: express.RequestHandler
  ) {
    const before: RequestHandlerParams[] = [
      ...(controllerMeta.middleware.before || []),
      ...(methodMeta.middleware.before || [])
    ]
    const after: RequestHandlerParams[] = [
      ...(methodMeta.middleware.after || []),
      ...(controllerMeta.middleware.after || [])
    ]

    switch (methodMeta.method) {
      case 'get':
        router.get(methodMeta.path, ...before, handler, ...after)
        break
      case 'post':
        router.post(methodMeta.path, ...before, handler, ...after)
        break
      case 'put':
        router.put(methodMeta.path, ...before, handler, ...after)
        break
      case 'patch':
        router.patch(methodMeta.path, ...before, handler, ...after)
        break
      case 'delete':
        router.delete(methodMeta.path, ...before, handler, ...after)
        break
      case 'options':
        router.options(methodMeta.path, ...before, handler, ...after)
        break
      case 'head':
        router.head(methodMeta.path, ...before, handler, ...after)
        break
      case 'all':
        router.all(methodMeta.path, ...before, handler, ...after)
        break
      default:
        throw new Error(`"${methodMeta.method}" is not a valid method.`)
    }
  }
}
