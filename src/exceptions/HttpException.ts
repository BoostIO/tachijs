import { HttpStatusEnum } from '../httpStatusEnum'

export class HttpException extends Error {
  constructor(
    public readonly message: string,
    public readonly status: number = HttpStatusEnum.INTERNAL_SERVER_ERROR
  ) {
    super(message)
  }
}
