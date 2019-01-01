import {
  BaseController,
  EndResult,
  JSONResult,
  RedirectResult,
  RenderResult,
  SendFileResult,
  SendResult,
  SendStatusResult
} from '../index'

describe('BaseController', () => {
  const controller = new BaseController()
  describe('#end', () => {
    it('returns EndResult', () => {
      // When
      const result = controller.end('test')

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
      const result = controller.json({
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
      const result = controller.redirect('/test')

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
      const result = controller.render('test')

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
      const result = controller.sendFile('/file-path')

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
      const result = controller.send('test')

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
      const result = controller.sendStatus(201)

      // Then
      expect(result).toBeInstanceOf(SendStatusResult)
      expect(result).toMatchObject({
        status: 201
      })
    })
  })
})
