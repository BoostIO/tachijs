import { HttpException } from './HttpException'
import { HttpStatusEnum } from '../HttpStatusEnum'

export class NotAcceptableException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatusEnum.NOT_ACCEPTABLE)
  }
}
