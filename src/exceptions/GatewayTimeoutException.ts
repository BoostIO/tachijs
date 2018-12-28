import { HttpException } from './HttpException'
import { HttpStatus } from '../consts'

export class GatewayTimeoutException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatus.GATEWAY_TIMEOUT)
  }
}
