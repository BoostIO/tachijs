import { HttpException } from './HttpException'
import { HttpStatusEnum } from '../HttpStatusEnum'

export class BadRequestException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatusEnum.BAD_REQUEST)
  }
}
