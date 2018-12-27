import express from 'express'
import { getControllerMeta } from './controller'
import { getHttpMethodMetaList, HttpMethodMeta } from './httpMethods'
import { getHandlerParamMetaList } from './handlerParam'
import { BaseResult } from './results'

export interface TachiJSOptions {
  before?: (app: express.Application) => Promise<void>
  after?: (app: express.Application) => void
  controllers: any[]
}

export function tachijs(options: TachiJSOptions): express.Application {
  const app = express()
  const { controllers, before, after } = options

  if (before != null) before(app)

  controllers.map(registerControllerToApp(app))

  if (after != null) after(app)

  return app
}

function registerControllerToApp(app: express.Application) {
  return (ControllerConstructor: any) => {
    const router = express.Router()
    const controllerMeta = getControllerMeta(ControllerConstructor)
    const controller = new ControllerConstructor()
    if (controllerMeta == null)
      throw new Error('Please apply @controller decorator.')
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

      const paramMetaList = getHandlerParamMetaList(controller.constructor)

      const args = paramMetaList.reduce(
        (acc, paramMeta) => {
          acc[paramMeta.index] = paramMeta.selector(req, res, next)
          return acc
        },
        [] as any[]
      )

      const result = await method(...args)
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
