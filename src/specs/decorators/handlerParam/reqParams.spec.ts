import tachijs, { controller, httpGet, reqParams } from '../../../index'
import request from 'supertest'

describe('reqParams', () => {
  it('selects req.params', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/:name')
      index(@reqParams() params: any) {
        return `Hello, ${params.name}`
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })

  it('selects a property from req.params', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/:name')
      index(@reqParams('name') name: string) {
        return `Hello, ${name}`
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })
})
