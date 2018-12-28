import { HttpException } from './HttpException'
import { HttpStatus } from '../consts'

export class ForbiddenException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatus.FORBIDDEN)
  }
}
