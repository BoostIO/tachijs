import { HttpStatusEnum } from '../HttpStatusEnum'

export class HttpException extends Error {
  constructor(
    public readonly message: string,
    public readonly status: number = HttpStatusEnum.INTERNAL_SERVER_ERROR
  ) {
    super(message)
  }
}
