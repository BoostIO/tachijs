import express from 'express'
import { BaseResult } from './BaseResult'
import { OutgoingHttpHeaders } from 'http'

export class RedirectResult extends BaseResult {
  constructor(
    public readonly location: string,
    public readonly status?: number,
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
    if (this.status != null) return res.redirect(this.status, this.location)
    return res.redirect(this.location)
  }
}
