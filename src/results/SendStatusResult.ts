import express from 'express'
import { BaseResult } from './BaseResult'

export class SendStatusResult extends BaseResult {
  constructor(public readonly status: number) {
    super()
  }

  async execute(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    return res.sendStatus(this.status)
  }
}
