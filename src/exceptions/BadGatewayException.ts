import { HttpException } from './HttpException'
import { HttpStatusEnum } from '../HttpStatusEnum'

export class BadGatewwayException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatusEnum.BAD_GATEWAY)
  }
}
