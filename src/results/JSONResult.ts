import express from 'express'
import { BaseResult } from './BaseResult'

export class JSONResult<D> extends BaseResult {
  constructor(public readonly data: D, public readonly status: number = 200) {
    super()
  }

  async execute(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    return res.status(this.status).json(this.data)
  }
}
