import tachijs, {
  controller,
  httpMethod,
  httpGet,
  httpPost,
  httpPut,
  httpPatch,
  httpDelete,
  httpOptions,
  httpHead,
  httpAll
} from '../../index'
import request from 'supertest'
import { RequestHandler, ErrorRequestHandler } from 'express'

describe('httpMethod', () => {
  it(`sets get method route`, async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpMethod('get', '/test')
      index() {
        return 'Hello'
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it(`sets post method route`, async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpMethod('post', '/test')
      index() {
        return 'Hello'
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).post('/test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it(`sets put method route`, async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpMethod('put', '/test')
      index() {
        return 'Hello'
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).put('/test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it(`sets patch method route`, async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpMethod('patch', '/test')
      index() {
        return 'Hello'
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).patch('/test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it(`sets delete method route`, async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpMethod('delete', '/test')
      index() {
        return 'Hello'
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).delete('/test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it(`sets options method route`, async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpMethod('options', '/test')
      index() {
        return ''
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).options('/test')

    // Then
    expect(response).toMatchObject({
      status: 200
    })
  })

  it(`sets head method route`, async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpMethod('head', '/test')
      index() {
        return ''
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).head('/test')

    // Then
    expect(response).toMatchObject({
      status: 200
    })
  })

  it(`sets all method route`, async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpMethod('all', '/test')
      index() {
        return 'Hello'
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it('throws an error if the method is not valid', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpMethod('wrong', '/')
      index() {
        return 'Hello'
      }
    }

    try {
      // When
      tachijs({
        controllers: [HomeController]
      })
    } catch (error) {
      // Then
      expect(error).toMatchObject({
        message: '"wrong" is not a valid method.'
      })
    }
  })

  it('sets middleware', async () => {
    // Given
    const beforeSpy = jest.fn()
    const afterSpy = jest.fn()
    const beforeMiddleware: RequestHandler = (req, res, next) => {
      beforeSpy()
      next()
    }
    const afterMiddleware: ErrorRequestHandler = (error, req, res, next) => {
      afterSpy()
      res.status(500).send('Handled')
    }

    // When
    @controller('/')
    class HomeController {
      @httpMethod('get', '/', {
        before: [beforeMiddleware],
        after: [afterMiddleware]
      })
      index() {
        throw new Error()
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 500,
      text: 'Handled'
    })
    expect(beforeSpy).toBeCalled()
    expect(afterSpy).toBeCalled()
  })

  it('sets before middleware if middleware is list of handlers', async () => {
    // Given
    const spy = jest.fn()
    const middleware: RequestHandler = (req, res, next) => {
      spy()
      next()
    }

    // When
    @controller('/')
    class HomeController {
      @httpMethod('get', '/', [middleware])
      index() {
        return 'Hello'
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
      text: 'Hello'
    })
    expect(spy).toBeCalled()
  })

  it('sets controller middleware and method middleware orderly', async () => {
    // Given
    const beforeControllerMiddlewareSpy = jest.fn()
    const afterControllerMiddlewareSpy = jest.fn()
    const beforeMethodMiddlewareSpy = jest.fn()
    const afterMethodMiddlewareSpy = jest.fn()
    let count = 0

    const beforeControllerMiddleware: RequestHandler = (req, res, next) => {
      beforeControllerMiddlewareSpy(++count)
      next()
    }
    const afterControllerMiddleware: ErrorRequestHandler = (
      error,
      req,
      res,
      next
    ) => {
      afterControllerMiddlewareSpy(++count)
      res.status(500).send('Handled')
    }
    const beforeMethodMiddleware: RequestHandler = (req, res, next) => {
      beforeMethodMiddlewareSpy(++count)
      next()
    }
    const afterMethodMiddleware: ErrorRequestHandler = (
      error,
      req,
      res,
      next
    ) => {
      afterMethodMiddlewareSpy(++count)
      next(error)
    }

    // When
    @controller('/', {
      before: [beforeControllerMiddleware],
      after: [afterControllerMiddleware]
    })
    class HomeController {
      @httpMethod('get', '/', {
        before: [beforeMethodMiddleware],
        after: [afterMethodMiddleware]
      })
      index() {
        throw new Error()
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 500,
      text: 'Handled'
    })
    expect(beforeControllerMiddlewareSpy).toBeCalledWith(1)
    expect(beforeMethodMiddlewareSpy).toBeCalledWith(2)
    expect(afterMethodMiddlewareSpy).toBeCalledWith(3)
    expect(afterControllerMiddlewareSpy).toBeCalledWith(4)
  })

  it('registers routes from top to bottom', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpMethod('get', '/')
      index() {
        return 'Hello'
      }

      @httpMethod('get', '/')
      secondIndex() {
        return 'Hello Second'
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
      text: 'Hello'
    })
  })
})

describe('httpGet', () => {
  it(`sets get method route`, async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/test')
      index() {
        return 'Hello'
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })
})

describe('httpPost', () => {
  it(`sets post method route`, async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpPost('/test')
      index() {
        return 'Hello'
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).post('/test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })
})

describe('httpPut', () => {
  it(`sets put method route`, async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpPut('/test')
      index() {
        return 'Hello'
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).put('/test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })
})

describe('httpPatch', () => {
  it(`sets patch method route`, async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpPatch('/test')
      index() {
        return 'Hello'
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).patch('/test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })
})

describe('httpDelete', () => {
  it(`sets delete method route`, async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpDelete('/test')
      index() {
        return 'Hello'
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).delete('/test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })
})

describe('httpOptions', () => {
  it(`sets options method route`, async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpOptions('/test')
      index() {
        return ''
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).options('/test')

    // Then
    expect(response).toMatchObject({
      status: 200
    })
  })
})

describe('httpHead', () => {
  it(`sets head method route`, async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpHead('/test')
      index() {
        return ''
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).head('/test')

    // Then
    expect(response).toMatchObject({
      status: 200
    })
  })
})

describe('httpAll', () => {
  it(`sets a route for all methods`, async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpAll('/test')
      index() {
        return 'Hello'
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/test')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it(`sets multiple routes in same time`, async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpMethod('get', '/test')
      index() {
        return 'Hello'
      }

      @httpMethod('get', '/test2')
      index2() {
        return 'Hello2'
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const client = request(app)
    const response = await client.get('/test')
    const response2 = await client.get('/test2')

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
    expect(response2).toMatchObject({
      status: 200,
      text: 'Hello2'
    })
  })
})
