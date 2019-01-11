import tachijs, {
  ConfigSetter,
  controller,
  httpGet,
  reqCookies,
  cookieSetter,
  cookieClearer,
  reqSignedCookies,
  CookieSetter,
  CookieClearer
} from '../../../index'
import request from 'supertest'
import cookieParser from 'cookie-parser'

const before: ConfigSetter = app => {
  app.use(cookieParser('secret'))
}

describe('reqCookies', () => {
  it('selects req.cookies', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqCookies() cookies: any) {
        return `Hello, ${cookies.name}`
      }
    }
    const app = tachijs({
      before,
      controllers: [HomeController]
    })

    // When
    const response = await request(app)
      .get('/')
      .set('cookie', 'name=test;')
    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })

  it('selects a property from req.cookies', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqCookies('name') name: string) {
        return `Hello, ${name}`
      }
    }
    const app = tachijs({
      before,
      controllers: [HomeController]
    })

    // When
    const response = await request(app)
      .get('/')
      .set('cookie', 'name=test;')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })
})

describe('setCookie', () => {
  it('selects res.cookie', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@cookieSetter() setCookie: CookieSetter) {
        setCookie('name', 'test')
        return ''
      }

      @httpGet('/cookie')
      cookie(@reqCookies('name') name: string) {
        return `Hello, ${name}`
      }
    }
    const app = tachijs({
      before,
      controllers: [HomeController]
    })

    // When
    const client = request.agent(app)
    const response = await client.get('/')
    const response2 = await client.get('/cookie')

    // Then
    expect(response).toMatchObject({
      status: 200,
      header: {
        'set-cookie': ['name=test; Path=/']
      }
    })
    expect(response2).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })
})

describe('clearCookie', () => {
  it('selects res.clearCookie', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@cookieSetter() setCookie: CookieSetter) {
        setCookie('name', 'test')
        return ''
      }

      @httpGet('/clear')
      clear(@cookieClearer() clearCookie: CookieClearer) {
        clearCookie('name')
      }

      @httpGet('/cookie')
      cookie(@reqCookies('name') name: string = 'guest') {
        return `Hello, ${name}`
      }
    }
    const app = tachijs({
      before,
      controllers: [HomeController]
    })

    // When
    const client = request.agent(app)
    await client.get('/')
    const response = await client.get('/cookie')
    await client.get('/clear')
    const response2 = await client.get('/cookie')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
    expect(response2).toMatchObject({
      status: 200,
      text: 'Hello, guest'
    })
  })
})

describe('reqSignedCookies', () => {
  it('selects req.signedCookies', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqSignedCookies() cookies: any) {
        return `Hello, ${cookies.name}`
      }

      @httpGet('/test')
      test(@cookieSetter() setCookie: CookieSetter) {
        setCookie('name', 'test', { signed: true })
        return ''
      }
    }
    const app = tachijs({
      before,
      controllers: [HomeController]
    })

    // When
    const client = request.agent(app)
    await client.get('/test')
    const response = await client.get('/')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })

  it('selects a property from req.signedCookies', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqSignedCookies('name') name: string) {
        return `Hello, ${name}`
      }

      @httpGet('/test')
      test(@cookieSetter() setCookie: CookieSetter) {
        setCookie('name', 'test', { signed: true })
        return ''
      }
    }
    const app = tachijs({
      before,
      controllers: [HomeController]
    })

    // When
    const client = request.agent(app)
    await client.get('/test')
    const response = await client.get('/')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })
})
