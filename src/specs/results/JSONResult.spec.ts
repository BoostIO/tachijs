import tachijs, { controller, httpGet, JSONResult } from '../../index'
import request from 'supertest'

describe('JSONResult', () => {
  it('is handled with res.json', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new JSONResult({
          message: 'Hello'
        })
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
    expect(response).toMatchObject({
      status: 200,
      text: JSON.stringify({
        message: 'Hello'
      })
    })
  })

  it('takes status', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new JSONResult(
          {
            message: 'Hello'
          },
          201
        )
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)
    expect(response).toMatchObject({
      status: 201,
      text: JSON.stringify({
        message: 'Hello'
      })
    })
  })
})
