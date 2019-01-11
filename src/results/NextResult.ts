import express from 'express'
import { BaseResult } from './BaseResult'

export class NextResult extends BaseResult {
  constructor(public readonly error?: any) {
    super()
  }

  async execute(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    return next(this.error)
  }
}
