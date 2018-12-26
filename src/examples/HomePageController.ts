import { controller, httpMethod } from '../index'

@controller('/')
export default class HomePageController {
  @httpMethod('get', '/')
  async index() {
    return {
      test: 'value'
    }
  }
}
