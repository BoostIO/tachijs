import tachijs, { controller, httpGet, reqQuery } from '../../../index'
import request from 'supertest'

describe('reqQuery', () => {
  it('selects req.query', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqQuery() query: any) {
        return `Hello, ${query.name}`
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/?name=test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })

  it('selects a property from req.query', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqQuery('name') name: string) {
        return `Hello, ${name}`
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/?name=test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })
})
