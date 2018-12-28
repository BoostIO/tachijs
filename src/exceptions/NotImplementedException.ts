import { HttpException } from './HttpException'
import { HttpStatus } from '../consts'

export class NotImplementedException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatus.NOT_IMPLEMENTED)
  }
}
