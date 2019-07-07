import tachijs, { controller, httpGet, SendResult } from '../../index'
import request from 'supertest'

describe('SendResult', () => {
  it('uses res.send', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(): SendResult<string> {
        return new SendResult('Hello')
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

  it('accepts status', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(): SendResult<string> {
        return new SendResult('Hello', 201)
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 201,
      text: 'Hello'
    })
  })
})
