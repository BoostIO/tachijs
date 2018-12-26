import express from 'express'
import { getControllerMeta } from './controller'
import { getHttpMethodListMeta, HttpMethodMeta } from './httpMethods'

export interface BoostioOptions {
  before?: (app: express.Application) => Promise<void>
  after?: (app: express.Application) => void
  controllers: any[]
}

export function boostio(options: BoostioOptions): express.Application {
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
    const methodList = getHttpMethodListMeta(ControllerConstructor)
    methodList.map(methodMeta => {
      switch (methodMeta.method) {
        case 'get':
          router.get(
            methodMeta.path,
            makeRequestHandler(controller, methodMeta)
          )
          break
      }
    })
    app.use(controllerMeta.path, router)
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
      const result = await method()
      res.send(result)
      return
    } catch (error) {
      next(error)
      return
    }
  }
}
