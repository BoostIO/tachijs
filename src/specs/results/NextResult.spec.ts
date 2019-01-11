import tachijs, { controller, httpGet, NextResult } from '../../index'
import request from 'supertest'
import { ErrorRequestHandler } from 'express'

describe('NextResult', () => {
  it('uses next', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new NextResult()
      }

      @httpGet('/')
      next() {
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

  it('accepts error', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(): NextResult<Error> {
        return new NextResult(new Error('Hello'))
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })
    const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
      res.send(error.message)
    }
    app.use(errorHandler)

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })
})
