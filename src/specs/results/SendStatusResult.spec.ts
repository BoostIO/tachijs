import tachijs, { controller, httpGet, SendStatusResult } from '../../index'
import request from 'supertest'

describe('SendStatusResult', () => {
  it('uses res.sendStatus', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new SendStatusResult(200)
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'OK'
    })
  })
})
