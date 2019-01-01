import { HttpException } from './HttpException'
import { HttpStatus } from '../consts'

export class RequestTimeoutException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatus.REQUEST_TIMEOUT)
  }
}
