import { HttpException } from './HttpException'
import { HttpStatusEnum } from '../HttpStatusEnum'

export class ImATeapotException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatusEnum.I_AM_A_TEAPOT)
  }
}
