import {
  controller,
  httpMethod,
  httpGet,
  handlerParam,
  RedirectResult,
  inject
} from '../../'
import { MyService, ServiceTypes } from './services'

@controller('/')
export default class HomePageController {
  constructor(@inject(ServiceTypes.MyService) private myService: MyService) {}

  @httpMethod('get', '/')
  async index(@handlerParam(req => req.query) query: any) {
    this.myService.do()
    return {
      test: 'value',
      query
    }
  }

  @httpGet('/redirect')
  async redirect() {
    return new RedirectResult('/')
  }
}
