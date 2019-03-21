import request from 'supertest'
import {
  BaseController,
  EndResult,
  JSONResult,
  RedirectResult,
  RenderResult,
  SendFileResult,
  SendResult,
  SendStatusResult,
  controller,
  httpGet,
  tachijs
} from '../index'
import { ConfigSetter } from '../tachijs'
import { ErrorRequestHandler } from 'express'

describe('BaseController', () => {
  const baseController = new BaseController()
  describe('#end', () => {
    it('returns EndResult', () => {
      // When
      const result = baseController.end('test')

      // Then
      expect(result).toBeInstanceOf(EndResult)
      expect(result).toMatchObject({
        data: 'test'
      })
    })
  })

  describe('#json', () => {
    it('returns JSONResult', () => {
      // When
      const result = baseController.json({
        message: 'test'
      })

      // Then
      expect(result).toBeInstanceOf(JSONResult)
      expect(result).toMatchObject({
        data: {
          message: 'test'
        }
      })
    })
  })

  describe('#redirect', () => {
    it('returns RedirectResult', () => {
      // When
      const result = baseController.redirect('/test')

      // Then
      expect(result).toBeInstanceOf(RedirectResult)
      expect(result).toMatchObject({
        location: '/test'
      })
    })
  })

  describe('#render', () => {
    it('returns RenderResult', () => {
      // When
      const result = baseController.render('test')

      // Then
      expect(result).toBeInstanceOf(RenderResult)
      expect(result).toMatchObject({
        view: 'test'
      })
    })
  })

  describe('#sendFile', () => {
    it('returns SendFileResult', () => {
      // When
      const result = baseController.sendFile('/file-path')

      // Then
      expect(result).toBeInstanceOf(SendFileResult)
      expect(result).toMatchObject({
        filePath: '/file-path'
      })
    })
  })

  describe('#send', () => {
    it('returns SendResult', () => {
      // When
      const result = baseController.send('test')

      // Then
      expect(result).toBeInstanceOf(SendResult)
      expect(result).toMatchObject({
        data: 'test'
      })
    })
  })

  describe('#sendStatus', () => {
    it('returns SendStatusResult', () => {
      // When
      const result = baseController.sendStatus(201)

      // Then
      expect(result).toBeInstanceOf(SendStatusResult)
      expect(result).toMatchObject({
        status: 201
      })
    })
  })

  describe('#context.inject', () => {
    it('returns a registered service from the container', async () => {
      // Given
      enum ServiceTypes {
        MyService = 'MyService'
      }
      class MyService {
        sayHello() {
          return 'Hello'
        }
      }

      const container = {
        [ServiceTypes.MyService]: MyService
      }
      @controller('/')
      class HomeController extends BaseController {
        @httpGet('/')
        index() {
          return this.context!.inject<MyService>(
            ServiceTypes.MyService
          ).sayHello()
        }
      }
      const app = tachijs({
        controllers: [HomeController],
        container
      })

      // When
      const response = await request(app).get('/')

      // Then
      expect(response).toMatchObject({
        status: 200,
        text: 'Hello'
      })
    })

    it('throws an error if no service registered for the given key', async () => {
      // Given
      enum ServiceTypes {
        MyService = 'MyService'
      }
      class MyService {
        sayHello() {
          return 'Hello'
        }
      }

      @controller('/')
      class HomeController extends BaseController {
        @httpGet('/')
        index() {
          return this.context!.inject<MyService>(
            ServiceTypes.MyService
          ).sayHello()
        }
      }
      const after: ConfigSetter = expressApp => {
        const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
          res.status(500).json({
            message: error.message
          })
        }
        expressApp.use(errorHandler)
      }
      const app = tachijs({
        controllers: [HomeController],
        after
      })

      // When
      const response = await request(app).get('/')

      // Then
      expect(response).toMatchObject({
        status: 500,
        text: JSON.stringify({
          message: 'No service is registered for "MyService" key.'
        })
      })
    })
  })
})
