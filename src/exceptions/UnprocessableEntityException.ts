import { HttpException } from './HttpException'
import { HttpStatusEnum } from '../HttpStatusEnum'

export class UnprocessableEntityException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatusEnum.UNPROCESSABLE_ENTITY)
  }
}
