import { HttpException } from './HttpException'
import { HttpStatus } from '../consts'

export class UnsupportedMediaTypeException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatus.UNSUPPORTED_MEDIA_TYPE)
  }
}
