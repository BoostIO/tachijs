import { HttpException } from './HttpException'
import { HttpStatus } from '../consts'

export class BadRequestException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatus.BAD_REQUEST)
  }
}
