import tachijs, { controller, httpGet, reqHeaders } from '../../../index'
import request from 'supertest'

describe('reqHeaders', () => {
  it('selects req.headers', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqHeaders() headers: any) {
        return `Hello, ${headers.name}`
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app)
      .get('/')
      .set('Name', 'test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })

  it('selects a property from req.headers', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqHeaders('name') name: string) {
        return `Hello, ${name}`
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app)
      .get('/')
      .set('Name', 'test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })
})
