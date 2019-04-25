import express from 'express'
import { BaseResult } from './BaseResult'
import { OutgoingHttpHeaders } from 'http'

export class SendStatusResult extends BaseResult {
  constructor(
    public readonly status: number,
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
    return res.sendStatus(this.status)
  }
}
