import { HttpException } from './HttpException'
import { HttpStatus } from '../consts'

export class UnauthorizedException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatus.UNAUTHORIZED)
  }
}
