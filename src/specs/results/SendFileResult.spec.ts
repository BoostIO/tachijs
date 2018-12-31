import tachijs, { controller, httpGet, SendFileResult } from '../../index'
import request from 'supertest'
import path from 'path'

describe('SendFileResult', () => {
  it('is handled with res.sendFile', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new SendFileResult(
          path.join(__dirname, '../dummy/files/readme.md')
        )
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/')
    expect(response).toMatchObject({
      status: 200,
      text: '# Test document\n'
    })
  })

  it('accepts options', async () => {
    // When
    @controller('/')
    class HomeController {
      @httpGet('/')
      index() {
        return new SendFileResult('readme.md', {
          root: path.join(__dirname, '../dummy/files')
        })
      }
    }

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/')
    expect(response).toMatchObject({
      status: 200,
      text: '# Test document\n'
    })
  })

  it('accepts callback', async () => {
    // When
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

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/')
    expect(response).toMatchObject({
      status: 200,
      text: 'Not Found'
    })
  })

  it('accepts status', async () => {
    // When
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

    // Then
    const app = tachijs({
      controllers: [HomeController]
    })
    const response = await request(app).get('/')
    expect(response).toMatchObject({
      status: 201,
      text: '# Test document\n'
    })
  })
})
