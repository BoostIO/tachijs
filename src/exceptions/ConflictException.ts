import { HttpException } from './HttpException'
import { HttpStatusEnum } from '../HttpStatusEnum'

export class ConflictException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatusEnum.CONFLICT)
  }
}
