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

    // When
    const app = tachijs({
      controllers: [HomeController]
    })

    // Then
    const response = await request(app).get('/')
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

    // When
    tachijs({
      app
    })

    // Then
    const response = await request(app).get('/')
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

    // When
    const app = tachijs({
      before
    })

    // Then
    const response = await request(app).get('/')
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

    // When
    const app = tachijs({
      before,
      after
    })

    // Then
    const response = await request(app).get('/')
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

    // When
    const app = tachijs({
      controllers: [HomeController],
      container
    })

    // Then
    const response = await request(app).get('/')
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
    expect(response).toMatchObject({
      status: 500,
      text: JSON.stringify({
        message:
          'The constructor for "MyService" is not registered in the current container.'
      })
    })
  })

  it('exposes httpContext if controller is extended from BaseController', async () => {
    // Given
    @controller('/')
    class HomeController extends BaseController {
      @httpGet('/')
      index() {
        return this.httpContext!.req.query.message
      }
    }

    // When
    const app = tachijs({
      controllers: [HomeController]
    })

    // Then
    const response = await request(app).get('/?message=test')
    expect(response).toMatchObject({
      status: 200,
      text: 'test'
    })
  })
})
