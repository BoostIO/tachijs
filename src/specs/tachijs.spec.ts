import tachijs, {
  ConfigSetter,
  controller,
  httpGet,
  inject,
  BaseController
} from '../index'
import request from 'supertest'
import express, { ErrorRequestHandler } from 'express'

describe('tachijs', () => {
  it('registers controllers and serves', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return 'Hello'
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it('registers controllers from top to bottom', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return 'Hello'
      }
    }
    @controller('/')
    class SecondController {
      @httpGet('/')
      index() {
        return 'Hello Second'
      }
    }
    const app = tachijs({
      controllers: [HomeController, SecondController]
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it('throws an error if there is an invalid controller', () => {
    // Given
    class HomeController {
      @httpGet('/')
      index() {
        return 'Hello'
      }
    }
    expect.assertions(1)

    // When
    try {
      tachijs({
        controllers: [HomeController]
      })
    } catch (error) {
      // Then
      expect(error).toMatchObject({
        message: 'Please apply @controller decorator to "HomeController".'
      })
    }
  })

  it('accepts express app', async () => {
    // Given
    const app = express()
    app.use('*', (req, res) => res.send('Hello'))
    tachijs({
      app
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it('registers before middleware', async () => {
    // Given
    const before: ConfigSetter = expressApp => {
      expressApp.use('*', (req, res) => res.send('Hello'))
    }
    const app = tachijs({
      before
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it('registers after middleware', async () => {
    // Given
    const before: ConfigSetter = expressApp => {
      expressApp.use('*', (req, res, next) => next(new Error('Error!')))
    }
    const errorHandler: ErrorRequestHandler = (error, req, res, next) =>
      res.status(500).send(error.message)
    const after: ConfigSetter = expressApp => {
      expressApp.use(errorHandler)
    }
    const app = tachijs({
      before,
      after
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 500,
      text: 'Error!'
    })
  })

  it('registers container', async () => {
    // Given
    enum ServiceTypes {
      MyService = 'MyService'
    }
    class MyService {
      sayHello() {
        return 'Hello'
      }
    }
    const container = {
      [ServiceTypes.MyService]: MyService
    }
    @controller('/')
    class HomeController {
      constructor(
        @inject(ServiceTypes.MyService) private myService: MyService
      ) {}
      @httpGet('/')
      index() {
        return this.myService.sayHello()
      }
    }
    const app = tachijs({
      controllers: [HomeController],
      container
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it('throws if correspond constructor does not exist in container', async () => {
    // Given
    enum ServiceTypes {
      MyService = 'MyService'
    }
    class MyService {
      sayHello() {
        return 'Hello'
      }
    }

    const container = {}

    @controller('/')
    class HomeController {
      constructor(
        @inject(ServiceTypes.MyService) private myService: MyService
      ) {}
      @httpGet('/')
      index() {
        return this.myService.sayHello()
      }
    }
    const after: ConfigSetter = expressApp => {
      const handler: ErrorRequestHandler = (error, req, res, next) => {
        res.status(500).json({
          message: error.message
        })
      }
      expressApp.use(handler)
    }
    const app = tachijs({
      after,
      controllers: [HomeController],
      container
    })
    expect.assertions(1)

    // When
    const response = await request(app).get('/?message=test')

    // Then
    expect(response).toMatchObject({
      status: 500,
      text: JSON.stringify({
        message:
          'No service is registered for "MyService" key. (While instantiating "HomeController")'
      })
    })
  })

  it('exposes context if controller is extended from BaseController', async () => {
    // Given
    @controller('/')
    class HomeController extends BaseController {
      @httpGet('/')
      index() {
        return this.context!.req.query.message
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/?message=test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'test'
    })
  })
})
