import tachijs, { controller, httpGet, reqHeaders } from '../../../index'
import request from 'supertest'

describe('reqHeaders', () => {
  it('selects req.headers', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqHeaders() headers: any) {
        return `Hello, ${headers.name}`
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app)
      .get('/')
      .set('Name', 'test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })

  it('selects a property from req.headers', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqHeaders('name') name: string) {
        return `Hello, ${name}`
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app)
      .get('/')
      .set('Name', 'test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })
})
