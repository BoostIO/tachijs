import { HttpException } from './HttpException'
import { HttpStatusEnum } from '../HttpStatusEnum'

export class ServiceUnavailableException extends HttpException {
  constructor(public readonly message: string) {
    super(message, HttpStatusEnum.SERVICE_UNAVAILABLE)
  }
}
