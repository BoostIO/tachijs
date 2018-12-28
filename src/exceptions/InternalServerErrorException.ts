import { HttpException } from './HttpException'
import { HttpStatusEnum } from '../HttpStatusEnum'

export class InternalServerErrorException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatusEnum.INTERNAL_SERVER_ERROR)
  }
}
