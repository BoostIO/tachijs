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
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqCookies() cookies: any) {
        return `Hello, ${cookies.name}`
      }
    }

    // Then
    const app = tachijs({
      before,
      controllers: [HomeController]
    })
    const response = await request(app)
      .get('/')
      .set('cookie', 'name=test;')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })

  it('selects a property from req.cookies', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqCookies('name') name: string) {
        return `Hello, ${name}`
      }
    }

    // Then
    const app = tachijs({
      before,
      controllers: [HomeController]
    })
    const response = await request(app)
      .get('/')
      .set('cookie', 'name=test;')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })
})

describe('setCookie', () => {
  it('selects res.cookie', async () => {
    // When
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

    // Then
    const app = tachijs({
      before,
      controllers: [HomeController]
    })
    const client = request.agent(app)
    const response = await client.get('/')
    expect(response).toMatchObject({
      status: 200,
      header: {
        'set-cookie': ['name=test; Path=/']
      }
    })
    const response2 = await client.get('/cookie')
    expect(response2).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })
})

describe('clearCookie', () => {
  it('selects res.clearCookie', async () => {
    // When
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

    // Then
    const app = tachijs({
      before,
      controllers: [HomeController]
    })
    const client = request.agent(app)
    await client.get('/')
    const response = await client.get('/cookie')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
    await client.get('/clear')
    const response2 = await client.get('/cookie')
    expect(response2).toMatchObject({
      status: 200,
      text: 'Hello, guest'
    })
  })
})

describe('reqSignedCookies', () => {
  it('selects req.signedCookies', async () => {
    // When
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

    // Then
    const app = tachijs({
      before,
      controllers: [HomeController]
    })
    const client = request.agent(app)
    await client.get('/test')
    const response = await client.get('/')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })

  it('selects a property from req.signedCookies', async () => {
    // When
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

    // Then
    const app = tachijs({
      before,
      controllers: [HomeController]
    })
    const client = request.agent(app)
    await client.get('/test')
    const response = await client.get('/')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })
})
