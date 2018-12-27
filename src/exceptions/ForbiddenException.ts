import { HttpException } from './HttpException'
import { HttpStatusEnum } from '../HttpStatusEnum'

export class ForbiddenException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatusEnum.FORBIDDEN)
  }
}
