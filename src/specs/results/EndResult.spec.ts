import tachijs, { controller, httpGet, EndResult } from '../../index'
import request from 'supertest'

describe('EndResult', () => {
  it('uses res.end', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new EndResult('Hello')
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

  it('accepts encoding', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new EndResult('Hello', 'ascii')
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    // NOTE: supertest cannot check encoding type
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
        return new EndResult('Hello', undefined, 201)
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
