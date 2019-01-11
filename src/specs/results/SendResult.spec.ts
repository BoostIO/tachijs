import tachijs, { controller, httpGet, SendResult } from '../../index'
import request from 'supertest'

describe('SendResult', () => {
  it('uses res.send', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new SendResult('Hello')
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it('accepts status', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new SendResult('Hello', 201)
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/')
    expect(response).toMatchObject({
      status: 201,
      text: 'Hello'
    })
  })
})
