import tachijs, { controller, httpGet, SendStatusResult } from '../../index'
import request from 'supertest'

describe('SendStatusResult', () => {
  it('is handled with res.sendStatus', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new SendStatusResult(200)
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/')
    expect(response).toMatchObject({
      status: 200,
      text: 'OK'
    })
  })
})
