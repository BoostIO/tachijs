import 'reflect-metadata'
import tachijs, {
  ConfigSetter,
  controller,
  httpPost,
  handlerParam
} from '../../../index'
import request from 'supertest'
import bodyParser from 'body-parser'

class HomeIndexBodyDTO {
  name: string

  constructor(body: unknown) {
    this.name = (body as any).name != null ? (body as any).name : 'unknown'
  }
}

function validatedBody(callback: (meta: any) => void) {
  return handlerParam((req, res, next, meta) => {
    callback(meta)
    return new HomeIndexBodyDTO(req.body)
  })
}

describe('reqBody', () => {
  it('selects req.body', async () => {
    // Given
    const before: ConfigSetter = expressApp => {
      expressApp.use(bodyParser.json())
    }
    const callback = jest.fn()

    @controller('/')
    class HomeController {
      @httpPost('/')
      index(@validatedBody(callback) body: HomeIndexBodyDTO) {
        return `Hello, ${body.name}`
      }
    }
    const app = tachijs({
      before,
      controllers: [HomeController]
    })

    // When
    const response = await request(app)
      .post('/')
      .send({
        name: 'test'
      })

    // Then
    expect(callback).toBeCalledWith({
      index: 0,
      paramType: HomeIndexBodyDTO,
      selector: expect.any(Function)
    })
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })
})
