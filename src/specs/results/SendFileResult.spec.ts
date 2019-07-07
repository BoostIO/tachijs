import tachijs, { controller, httpGet, SendFileResult } from '../../index'
import request from 'supertest'
import path from 'path'

describe('SendFileResult', () => {
  it('uses res.sendFile', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new SendFileResult(
          path.join(__dirname, '../dummy/files/readme.md')
        )
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
      text: '# Test document\n'
    })
  })

  it('accepts options', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new SendFileResult('readme.md', {
          root: path.join(__dirname, '../dummy/files')
        })
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
      text: '# Test document\n'
    })
  })

  it('accepts callback', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new SendFileResult(
          path.join(__dirname, '../dummy/files/wrong.md'),
          undefined,
          (error, req, res) => {
            res.send(error!.message)
          }
        )
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
      text: 'Not Found'
    })
  })

  it('accepts status', async () => {
    // Given
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new SendFileResult(
          path.join(__dirname, '../dummy/files/readme.md'),
          undefined,
          undefined,
          201
        )
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app).get('/')

    // Then
    expect(response).toMatchObject({
      status: 201,
      text: '# Test document\n'
    })
  })
})
