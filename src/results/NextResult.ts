import express from 'express'
import { BaseResult } from './BaseResult'

export class NextResult<E> extends BaseResult {
  constructor(public readonly error?: E) {
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
