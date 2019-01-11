import tachijs, {
  ConfigSetter,
  controller,
  httpPost,
  reqBody
} from '../../../index'
import request from 'supertest'
import bodyParser from 'body-parser'
import { ErrorRequestHandler } from 'express'
import { IsString } from 'class-validator'

describe('reqBody', () => {
  it('selects req.body', async () => {
    // Given
    const before: ConfigSetter = expressApp => {
      expressApp.use(bodyParser.json())
    }

    @controller('/')
    class HomeController {
      @httpPost('/')
      index(@reqBody() body: any) {
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
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })

  it('selects, validates and transforms req.body(validator from param types metadata)', async () => {
    // Given
    const before: ConfigSetter = expressApp => {
      expressApp.use(bodyParser.json())
    }
    class UserDTO {
      @IsString()
      name: string
    }
    @controller('/')
    class HomeController {
      @httpPost('/')
      index(@reqBody() user: UserDTO) {
        expect(user).toBeInstanceOf(UserDTO)
        return `Hello, ${user.name}`
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
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })

  it('selects, validates and transforms req.body(validator from decorator argument)', async () => {
    // Given
    const before: ConfigSetter = expressApp => {
      expressApp.use(bodyParser.json())
    }
    class UserDTO {
      @IsString()
      name: string
    }
    @controller('/')
    class HomeController {
      @httpPost('/')
      index(@reqBody(UserDTO) user: UserDTO) {
        expect(user).toBeInstanceOf(UserDTO)
        return `Hello, ${user.name}`
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
    expect(response).toMatchObject({
      status: 200,
      text: 'Hello, test'
    })
  })

  it('throws when req.body is invalid', async () => {
    // Given
    const before: ConfigSetter = expressApp => {
      expressApp.use(bodyParser.json())
    }
    const after: ConfigSetter = expressApp => {
      expressApp.use(((error, req, res, next) => {
        if (Array.isArray(error)) {
          return res.status(422).json({
            message: error.toString().trim(),
            errors: error
          })
        }
        return next(error)
      }) as ErrorRequestHandler)
    }
    class UserDTO {
      @IsString()
      name: string
    }
    @controller('/')
    class HomeController {
      @httpPost('/')
      index(@reqBody() user: UserDTO) {
        return `Hello, ${user.name}`
      }
    }
    const app = tachijs({
      before,
      after,
      controllers: [HomeController]
    })

    // When
    const response = await request(app).post('/')

    // Then
    expect(response).toMatchObject({
      status: 422,
      text: JSON.stringify({
        message:
          'An instance of UserDTO has failed the validation:\n - property name has failed the following constraints: isString',
        errors: [
          {
            target: {},
            property: 'name',
            children: [],
            constraints: {
              isString: 'name must be a string'
            }
          }
        ]
      })
    })
  })
})
