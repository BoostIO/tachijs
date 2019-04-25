import express from 'express'
import { BaseResult } from './BaseResult'
import { OutgoingHttpHeaders } from 'http'

export class SendResult<D> extends BaseResult {
  constructor(
    public readonly data: D,
    public readonly status: number = 200,
    public readonly headers?: OutgoingHttpHeaders
  ) {
    super()
  }

  async execute(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (this.headers != null) {
      res.set(this.headers)
    }
    return res.status(this.status).send(this.data)
  }
}
