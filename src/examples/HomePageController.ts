import { controller, httpMethod, handlerParam, RedirectResult } from '../index'

@controller('/')
export default class HomePageController {
  @httpMethod('get', '/')
  async index(@handlerParam(req => req.query) query: any) {
    return {
      test: 'value',
      query
    }
  }

  @httpMethod('get', '/redirect')
  async redirect() {
    return new RedirectResult('/')
  }
}
