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
} from '../index'
import request from 'supertest'

describe('httpMethod', () => {
  it(`sets get method route`, async () => {
    // When
    @controller('/')
    class HomeController {
      @httpMethod('get', '/test')
      index() {
        return 'Hello'
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it(`sets post method route`, async () => {
    // When
    @controller('/')
    class HomeController {
      @httpMethod('post', '/test')
      index() {
        return 'Hello'
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).post('/test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it(`sets put method route`, async () => {
    // When
    @controller('/')
    class HomeController {
      @httpMethod('put', '/test')
      index() {
        return 'Hello'
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).put('/test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it(`sets patch method route`, async () => {
    // When
    @controller('/')
    class HomeController {
      @httpMethod('patch', '/test')
      index() {
        return 'Hello'
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).patch('/test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it(`sets delete method route`, async () => {
    // When
    @controller('/')
    class HomeController {
      @httpMethod('delete', '/test')
      index() {
        return 'Hello'
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).delete('/test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it(`sets options method route`, async () => {
    // When
    @controller('/')
    class HomeController {
      @httpMethod('options', '/test')
      index() {
        return ''
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).options('/test')
    expect(response).toMatchObject({
      status: 200
    })
  })

  it(`sets head method route`, async () => {
    // When
    @controller('/')
    class HomeController {
      @httpMethod('head', '/test')
      index() {
        return ''
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).head('/test')
    expect(response).toMatchObject({
      status: 200
    })
  })

  it(`sets all method route`, async () => {
    // When
    @controller('/')
    class HomeController {
      @httpMethod('all', '/test')
      index() {
        return 'Hello'
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })

  it('throws an error if the method is not valid', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpMethod('wrong', '/')
      index() {
        return 'Hello'
      }
    }

    try {
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
})

describe('httpGet', () => {
  it(`sets get method route`, async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/test')
      index() {
        return 'Hello'
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })
})

describe('httpPost', () => {
  it(`sets post method route`, async () => {
    // When
    @controller('/')
    class HomeController {
      @httpPost('/test')
      index() {
        return 'Hello'
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).post('/test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })
})

describe('httpPut', () => {
  it(`sets put method route`, async () => {
    // When
    @controller('/')
    class HomeController {
      @httpPut('/test')
      index() {
        return 'Hello'
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).put('/test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })
})

describe('httpPatch', () => {
  it(`sets patch method route`, async () => {
    // When
    @controller('/')
    class HomeController {
      @httpPatch('/test')
      index() {
        return 'Hello'
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).patch('/test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })
})

describe('httpDelete', () => {
  it(`sets delete method route`, async () => {
    // When
    @controller('/')
    class HomeController {
      @httpDelete('/test')
      index() {
        return 'Hello'
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).delete('/test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })
})

describe('httpOptions', () => {
  it(`sets options method route`, async () => {
    // When
    @controller('/')
    class HomeController {
      @httpOptions('/test')
      index() {
        return ''
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).options('/test')
    expect(response).toMatchObject({
      status: 200
    })
  })
})

describe('httpHead', () => {
  it(`sets head method route`, async () => {
    // When
    @controller('/')
    class HomeController {
      @httpHead('/test')
      index() {
        return ''
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).head('/test')
    expect(response).toMatchObject({
      status: 200
    })
  })
})

describe('httpAll', () => {
  it(`sets a route for all methods`, async () => {
    // When
    @controller('/')
    class HomeController {
      @httpAll('/test')
      index() {
        return 'Hello'
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/test')
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello'
    })
  })
})
