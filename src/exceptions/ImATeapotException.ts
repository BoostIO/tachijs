import { HttpException } from './HttpException'
import { HttpStatus } from '../consts'

export class ImATeapotException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatus.I_AM_A_TEAPOT)
  }
}
