import { HttpException } from './HttpException'
import { HttpStatus } from '../consts'

export class PayloadTooLargeException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatus.PAYLOAD_TOO_LARGE)
  }
}
