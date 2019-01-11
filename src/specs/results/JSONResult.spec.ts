import tachijs, { controller, httpGet, JSONResult } from '../../index'
import request from 'supertest'

describe('JSONResult', () => {
  it('uses res.json', async () => {
    // Given
    interface IndexResponseData {
      message: string
    }
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(): JSONResult<IndexResponseData> {
        return new JSONResult({
          message: 'Hello'
        })
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)

    // Then
    expect(response).toMatchObject({
      status: 200,
      text: JSON.stringify({
        message: 'Hello'
      })
    })
  })

  it('accepts status', async () => {
    // Given
    interface IndexResponseData {
      message: string
    }
    @controller('/')
    class HomeController {
      @httpGet('/')
      index(): JSONResult<IndexResponseData> {
        return new JSONResult(
          {
            message: 'Hello'
          },
          201
        )
      }
    }
    const app = tachijs({
      controllers: [HomeController]
    })

    // When
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /json/)

    // Then
    expect(response).toMatchObject({
      status: 201,
      header: {
        'content-type': expect.stringContaining('application/json;')
      },
      text: JSON.stringify({
        message: 'Hello'
      })
    })
  })
})
