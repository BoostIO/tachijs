import tachijs, {
  ConfigSetter,
  controller,
  httpGet,
  httpPost,
  handlerParam,
  reqParams,
  reqBody,
  reqQuery,
  reqHeaders,
  reqCookies,
  setCookie,
  clearCookie,
  reqSignedCookies,
  CookieSetter,
  CookieClearer
} from '../../index'
import request from 'supertest'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

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

describe('reqParams', () => {
  it('selects req.params', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/:name')
      index(@reqParams() params: any) {
        return `Hello, ${params.name}`
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

  it('selects a property from req.params', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/:name')
      index(@reqParams('name') name: string) {
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

describe('reqBody', () => {
  it('selects req.body', async () => {
    // Given
    const before: ConfigSetter = app => {
      app.use(bodyParser.json())
    }

    // When
    @controller('/')
    class HomeController {
      @httpPost('/')
      index(@reqBody() body: any) {
        return `Hello, ${body.name}`
      }
    }

    // Then
    const app = tachijs({
      before,
      controllers: [HomeController]
    })
    const response = await request(app)
      .post('/')
      .send({
        name: 'test'
      })
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })
})

describe('reqQuery', () => {
  it('selects req.query', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqQuery() query: any) {
        return `Hello, ${query.name}`
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/?name=test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })

  it('selects a property from req.query', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqQuery('name') name: string) {
        return `Hello, ${name}`
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/?name=test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })
})

describe('reqHeaders', () => {
  it('selects req.headers', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqHeaders() headers: any) {
        return `Hello, ${headers.name}`
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app)
      .get('/')
      .set('Name', 'test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })

  it('selects a property from req.headers', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqHeaders('name') name: string) {
        return `Hello, ${name}`
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app)
      .get('/')
      .set('Name', 'test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })
})

describe('reqCookies', () => {
  it('selects req.cookies', async () => {
    // Given
    const before: ConfigSetter = app => {
      app.use(cookieParser())
    }

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
    // Given
    const before: ConfigSetter = app => {
      app.use(cookieParser())
    }

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
    // Given
    const before: ConfigSetter = app => {
      app.use(cookieParser())
    }

    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@setCookie() setCookie: CookieSetter) {
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
    // Given
    const before: ConfigSetter = app => {
      app.use(cookieParser())
    }

    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@setCookie() setCookie: CookieSetter) {
        setCookie('name', 'test')
        return ''
      }

      @httpGet('/clear')
      clear(@clearCookie() clearCookie: CookieClearer) {
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
    // Given
    const secret = 'secret'
    const before: ConfigSetter = app => {
      app.use(cookieParser(secret))
    }

    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqSignedCookies() cookies: any) {
        return `Hello, ${cookies.name}`
      }

      @httpGet('/test')
      test(@setCookie() setCookie: CookieSetter) {
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
    // Given
    const secret = 'secret'
    const before: ConfigSetter = app => {
      app.use(cookieParser(secret))
    }

    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqSignedCookies('name') name: string) {
        return `Hello, ${name}`
      }

      @httpGet('/test')
      test(@setCookie() setCookie: CookieSetter) {
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
