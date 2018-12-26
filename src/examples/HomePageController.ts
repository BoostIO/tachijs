import { controller, httpMethod, handlerParam } from '../index'

@controller('/')
export default class HomePageController {
  @httpMethod('get', '/')
  async index(@handlerParam(req => req.query) query: any) {
    return {
      test: 'value',
      query
    }
  }
}
