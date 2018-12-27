import express from 'express'
import { BaseResult } from './BaseResult'

export class RedirectResult extends BaseResult {
  constructor(public readonly location: string) {
    super()
  }

  async execute(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    return res.redirect(this.location)
  }
}
