import tachijs, { ConfigSetter, controller, httpGet } from '../../index'
import request from 'supertest'
import { ErrorRequestHandler, RequestHandler } from 'express'
import { reqParams } from '../../decorators'

describe('controller', () => {
  it('sets path to router', async () => {
    // Given
    @controller('/test')
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
    const response = await request(app).get('/test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it('handles thrown errors', async () => {
    // Given
    const errorHandler: ErrorRequestHandler = (error, req, res, next) =>
      res.status(500).send(error.message)
    const after: ConfigSetter = expressApp => {
      expressApp.use(errorHandler)
    }

    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        throw new Error('Error!')
      }
    }
    const app = tachijs({
      controllers: [HomeController],
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

  it('sets middlewares', async () => {
    // Given
    const spy = jest.fn()
    const middleware: RequestHandler = (req, res, next) => {
      spy()
      next()
    }

    @controller('/test', [middleware])
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
    const response = await request(app).get('/test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
    expect(spy).toBeCalled()
  })

  it('sets middlewares individually', async () => {
    // Given
    const spy = jest.fn()
    const middleware: RequestHandler = (req, res, next) => {
      spy()
      next()
    }

    @controller('/test', [middleware])
    class HomeController {
      @httpGet('/')
      index() {
        return 'Hello'
      }
    }
    @controller('/test')
    class UserController {
      @httpGet('/user')
      index() {
        return 'User'
      }
    }
    const app = tachijs({
      controllers: [HomeController, UserController]
    })

    // When
    const homeResponse = await request(app).get('/test')
    const userResponse = await request(app).get('/test/user')

    // Then
    expect(homeResponse).toMatchObject({
      status: 200,
      text: 'Hello'
    })
    expect(userResponse).toMatchObject({
      status: 200,
      text: 'User'
    })
    expect(spy).toBeCalledTimes(1)
  })

  it('sets router options', async () => {
    // Given
    @controller('/:name', [], {
      mergeParams: true
    })
    class HomeController {
      @httpGet('/hello')
      index(@reqParams('name') name: string) {
        return `Hello, ${name}`
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/test/hello')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })
})
