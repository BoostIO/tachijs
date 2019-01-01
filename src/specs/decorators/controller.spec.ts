import tachijs, { ConfigSetter, controller, httpGet } from '../../index'
import request from 'supertest'
import { ErrorRequestHandler } from 'express'

describe('controller', () => {
  it('sets path to router', async () => {
    // When
    @controller('/test')
    class HomeController {
      @httpGet('/')
      index() {
        return 'Hello'
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it('handles thrown errors', async () => {
    // Given
    const errorHandler: ErrorRequestHandler = (error, req, res, next) =>
      res.status(500).send(error.message)
    const after: ConfigSetter = app => {
      app.use(errorHandler)
    }

    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        throw new Error('Error!')
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController],
      after
    })
    const response = await request(app).get('/')
    expect(response).toMatchObject({
      status: 500,
      text: 'Error!'
    })
  })
})
