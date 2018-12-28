import express from 'express'
import { BaseResult } from './BaseResult'

export class SendResult extends BaseResult {
  constructor(public readonly data: any, public readonly status: number = 200) {
    super()
  }

  async execute(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    return res.status(this.status).send(this.data)
  }
}
