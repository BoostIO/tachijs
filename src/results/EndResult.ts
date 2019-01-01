import express from 'express'
import { BaseResult } from './BaseResult'

export class EndResult extends BaseResult {
  constructor(
    public readonly data: any,
    public readonly encoding?: string,
    public readonly status: number = 200
  ) {
    super()
  }

  async execute(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (this.encoding != null) {
      return res.status(this.status).end(this.data, this.encoding)
    }
    return res.status(this.status).end(this.data)
  }
}
