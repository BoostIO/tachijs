import { HttpException } from './HttpException'
import { HttpStatusEnum } from '../HttpStatusEnum'

export class UnsupportedMediaTypeException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatusEnum.UNSUPPORTED_MEDIA_TYPE)
  }
}
