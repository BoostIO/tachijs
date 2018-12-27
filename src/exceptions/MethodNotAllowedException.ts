import { HttpException } from './HttpException'
import { HttpStatusEnum } from '../HttpStatusEnum'

export class MethodNotAllowedException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatusEnum.METHOD_NOT_ALLOWED)
  }
}
