import { HttpException } from './HttpException'
import { HttpStatusEnum } from '../HttpStatusEnum'

export class GatewayTimeoutException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatusEnum.GATEWAY_TIMEOUT)
  }
}
