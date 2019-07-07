import tachijs, { controller, httpGet, EndResult } from '../../index'
import request from 'supertest'

describe('EndResult', () => {
  it('uses res.end', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(): EndResult<string> {
        return new EndResult('Hello')
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

  it('accepts encoding', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(): EndResult<string> {
        return new EndResult('Hello', 'ascii')
      }
    }

    // When
    const app = tachijs({
      controllers: [HomeController]
    })

    // Then
    const response = await request(app).get('/')

    // NOTE: supertest cannot check encoding type
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
      index(): EndResult<string> {
        return new EndResult('Hello', undefined, 201)
      }
    }

    // When
    const app = tachijs({
      controllers: [HomeController]
    })

    // Then
    const response = await request(app).get('/')
    expect(response).toMatchObject({
      status: 201,
      text: 'Hello'
    })
  })
})
