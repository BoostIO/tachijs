import express from 'express'
import { BaseResult } from './BaseResult'

export class EndResult<D> extends BaseResult {
  constructor(
    public readonly data: D,
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
