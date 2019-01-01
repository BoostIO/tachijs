import { HttpException } from './HttpException'
import { HttpStatus } from '../consts'

export class ServiceUnavailableException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatus.SERVICE_UNAVAILABLE)
  }
}
