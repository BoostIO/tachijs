import { HttpException } from './HttpException'
import { HttpStatusEnum } from '../HttpStatusEnum'

export class PayloadTooLargeException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatusEnum.PAYLOAD_TOO_LARGE)
  }
}
