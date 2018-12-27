import { EndResult } from './results'

export class BaseController {
  end(data: any, encoding: string, status?: number) {
    return new EndResult(data, encoding, status)
  }
}
