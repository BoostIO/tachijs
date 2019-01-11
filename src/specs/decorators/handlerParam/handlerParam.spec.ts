import tachijs, { controller, httpGet, handlerParam } from '../../../index'
import request from 'supertest'

describe('handlerParam', () => {
  it('selects value from context', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/:name')
      index(@handlerParam(req => req.params.name) name: string) {
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
