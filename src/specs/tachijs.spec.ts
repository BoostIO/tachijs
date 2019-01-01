import tachijs, { ConfigSetter, controller, httpGet, inject } from '../index'
import request from 'supertest'
import { ErrorRequestHandler } from 'express'

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

  it('registers before middleware', async () => {
    // Given
    const before: ConfigSetter = app => {
      app.use('*', (req, res) => res.send('Hello'))
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
    const before: ConfigSetter = app => {
      app.use('*', (req, res, next) => next(new Error('Error!')))
    }
    const errorHandler: ErrorRequestHandler = (error, req, res, next) =>
      res.status(500).send(error.message)
    const after: ConfigSetter = app => {
      app.use(errorHandler)
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
})
