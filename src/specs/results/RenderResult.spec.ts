import tachijs, {
  controller,
  ConfigSetter,
  httpGet,
  RenderResult
} from '../../index'
import request from 'supertest'
import path from 'path'

describe('RenderResult', () => {
  it('is handled with res.render', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new RenderResult('test')
      }
    }
    const before: ConfigSetter = app => {
      app.set('view engine', 'pug')
      app.set('views', path.join(__dirname, './views'))
    }

    // Then
    const app = tachijs({
      before,
      controllers: [HomeController]
    })
    const response = await request(app).get('/')
    expect(response).toMatchObject({
      status: 200,
      text: '<h1>Hello</h1>'
    })
  })

  it('accepts data', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new RenderResult('test', { message: 'test' })
      }
    }
    const before: ConfigSetter = app => {
      app.set('view engine', 'pug')
      app.set('views', path.join(__dirname, './views'))
    }

    // Then
    const app = tachijs({
      before,
      controllers: [HomeController]
    })
    const response = await request(app).get('/')
    expect(response).toMatchObject({
      status: 200,
      text: '<h1>Hello</h1><p>test</p>'
    })
  })

  it('accepts a callback', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new RenderResult('test', undefined, (error, html, req, res) => {
          res.send(html + 'test')
        })
      }
    }
    const before: ConfigSetter = app => {
      app.set('view engine', 'pug')
      app.set('views', path.join(__dirname, './views'))
    }

    // Then
    const app = tachijs({
      before,
      controllers: [HomeController]
    })
    const response = await request(app).get('/')
    expect(response).toMatchObject({
      status: 200,
      text: '<h1>Hello</h1>test'
    })
  })

  it('accepts a callback handling render errors', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new RenderResult('test', undefined, (error, html, req, res) => {
          res.status(500).send('Cannot read property message of null')
        })
      }
    }
    const before: ConfigSetter = app => {
      app.set('view engine', 'pug')
      app.set('views', path.join(__dirname, './views'))
    }

    // Then
    const app = tachijs({
      before,
      controllers: [HomeController]
    })
    const response = await request(app).get('/')
    expect(response).toMatchObject({
      status: 500,
      text: 'Cannot read property message of null'
    })
  })

  it('accepts status', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new RenderResult('test', undefined, undefined, 201)
      }
    }
    const before: ConfigSetter = app => {
      app.set('view engine', 'pug')
      app.set('views', path.join(__dirname, './views'))
    }

    // Then
    const app = tachijs({
      before,
      controllers: [HomeController]
    })
    const response = await request(app).get('/')
    expect(response).toMatchObject({
      status: 201,
      text: '<h1>Hello</h1>'
    })
  })
})
