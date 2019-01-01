import { HttpException } from './HttpException'
import { HttpStatus } from '../consts'

export class UnprocessableEntityException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY)
  }
}
