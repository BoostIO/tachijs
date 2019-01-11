import tachijs, { controller, httpGet, reqQuery } from '../../../index'
import request from 'supertest'

describe('reqQuery', () => {
  it('selects req.query', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqQuery() query: any) {
        return `Hello, ${query.name}`
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/?name=test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })

  it('selects a property from req.query', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqQuery('name') name: string) {
        return `Hello, ${name}`
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/?name=test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })
})
