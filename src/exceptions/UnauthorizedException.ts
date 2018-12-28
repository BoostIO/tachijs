import { HttpException } from './HttpException'
import { HttpStatusEnum } from '../HttpStatusEnum'

export class UnauthorizedException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatusEnum.UNAUTHORIZED)
  }
}
