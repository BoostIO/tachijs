import { HttpException } from './HttpException'
import { HttpStatus } from '../consts'

export class MethodNotAllowedException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatus.METHOD_NOT_ALLOWED)
  }
}
