import tachijs, { controller, httpGet, handlerParam } from '../../../index'
import request from 'supertest'

describe('handlerParam', () => {
  it('selects value from context', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/:name')
      index(@handlerParam(req => req.params.name) name: string) {
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
