import tachijs, {
  ConfigSetter,
  controller,
  httpGet,
  reqSession
} from '../../../index'
import request from 'supertest'
import expressSession from 'express-session'

describe('reqSession', () => {
  it('selects req.session', async () => {
    // Given
    const secret = 'secret'
    const before: ConfigSetter = app => {
      app.use(
        expressSession({
          secret,
          resave: true,
          saveUninitialized: false
        })
      )
    }

    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(@reqSession() session: Express.Session) {
        return `Hello, ${session.name}`
      }

      @httpGet('/test')
      async test(@reqSession() session: Express.Session) {
        await new Promise((resolve, reject) => {
          session.name = 'test'
          session.save(error => {
            if (error != null) return reject(error)
            resolve()
          })
        })
        return {}
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
