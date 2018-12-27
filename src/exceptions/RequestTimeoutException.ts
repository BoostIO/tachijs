import { HttpException } from './HttpException'
import { HttpStatusEnum } from '../HttpStatusEnum'

export class RequestTimeoutException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatusEnum.REQUEST_TIMEOUT)
  }
}
