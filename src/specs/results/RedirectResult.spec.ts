import tachijs, { controller, httpGet, RedirectResult } from '../../index'
import request from 'supertest'

describe('RedirectResult', () => {
  it('uses res.redirect', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new RedirectResult('/test')
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 302,
      header: {
        location: '/test'
      }
    })
  })

  it('accepts status', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new RedirectResult('/test', 300)
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 300,
      header: {
        location: '/test'
      }
    })
  })
})
