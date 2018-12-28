import { HttpException } from './HttpException'
import { HttpStatus } from '../consts'

export class GoneException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatus.GONE)
  }
}
