import { HttpException } from './HttpException'
import { HttpStatus } from '../consts'

export class InternalServerErrorException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR)
  }
}
