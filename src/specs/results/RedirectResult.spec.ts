import tachijs, { controller, httpGet, RedirectResult } from '../../index'
import request from 'supertest'

describe('RedirectResult', () => {
  it('is handled with res.redirect', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new RedirectResult('/test')
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/')

    expect(response).toMatchObject({
      status: 302,
      header: {
        location: '/test'
      }
    })
  })

  it('takes status', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new RedirectResult('/test', 300)
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/')

    expect(response).toMatchObject({
      status: 300,
      header: {
        location: '/test'
      }
    })
  })
})
