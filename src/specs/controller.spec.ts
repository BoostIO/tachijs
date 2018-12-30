import 'reflect-metadata'
import tachijs, { controller, httpGet } from '../index'
import request from 'supertest'

describe('controller', () => {
  it('sets path to router', async () => {
    // When
    @controller('/test')
    class HomeController {
      @httpGet('/')
      index() {
        return 'Hello'
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/test')
    expect(response).toMatchObject({
      text: 'Hello'
    })
  })
})
