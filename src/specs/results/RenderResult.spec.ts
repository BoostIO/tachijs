import tachijs, {
  controller,
  ConfigSetter,
  httpGet,
  RenderResult
} from '../../index'
import request from 'supertest'
import path from 'path'

const before: ConfigSetter = app => {
  app.set('view engine', 'pug')
  app.set('views', path.join(__dirname, '../dummy/views'))
}

describe('RenderResult', () => {
  it('uses res.render', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new RenderResult('test')
      }
    }
    const app = tachijs({
      before,
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: '<h1>Hello</h1>'
    })
  })

  it('accepts data', async () => {
    // Given
    interface IndexRenderLocals {
      message: string
    }
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(): RenderResult<IndexRenderLocals> {
        return new RenderResult('test', { message: 'test' })
      }
    }
    const app = tachijs({
      before,
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: '<h1>Hello</h1><p>test</p>'
    })
  })

  it('accepts a callback', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new RenderResult('test', undefined, (error, html, req, res) => {
          res.send(html + 'test')
        })
      }
    }
    const app = tachijs({
      before,
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: '<h1>Hello</h1>test'
    })
  })

  it('accepts a callback handling render errors', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new RenderResult('test', undefined, (error, html, req, res) => {
          res.status(500).send('Cannot read property message of null')
        })
      }
    }
    const app = tachijs({
      before,
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 500,
      text: 'Cannot read property message of null'
    })
  })

  it('accepts status', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new RenderResult('test', undefined, undefined, 201)
      }
    }
    const app = tachijs({
      before,
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 201,
      text: '<h1>Hello</h1>'
    })
  })
})
