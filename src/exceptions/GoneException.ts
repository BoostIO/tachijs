import { HttpException } from './HttpException'
import { HttpStatusEnum } from '../HttpStatusEnum'

export class GoneException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatusEnum.GONE)
  }
}
