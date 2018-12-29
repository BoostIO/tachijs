import 'reflect-metadata'
import tachijs, { controller } from '../index'
import { httpGet } from '../decorators'
import request from 'supertest'
import { ConfigSetter } from '../tachijs'

describe('tachijs', () => {
  it('registers controllers and serves', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return 'Hello'
      }
    }

    // When
    const app = tachijs({
      controllers: [HomeController]
    })

    // Then
    const response = await request(app).get('/')
    expect(response).toMatchObject({
      text: 'Hello'
    })
  })
})
