import tachijs, { controller, httpGet, reqParams } from '../../../index'
import request from 'supertest'

describe('reqParams', () => {
  it('selects req.params', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/:name')
      index(@reqParams() params: any) {
        return `Hello, ${params.name}`
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })

  it('selects a property from req.params', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/:name')
      index(@reqParams('name') name: string) {
        return `Hello, ${name}`
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })
})
