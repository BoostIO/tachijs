import { HttpException } from './HttpException'
import { HttpStatusEnum } from '../HttpStatusEnum'

export class NotImplementedException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatusEnum.NOT_IMPLEMENTED)
  }
}
