import express from 'express'
import { BaseResult } from './BaseResult'

export class RedirectResult extends BaseResult {
  constructor(
    public readonly location: string,
    public readonly status?: number
  ) {
    super()
  }

  async execute(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (this.status != null) return res.redirect(this.status, this.location)
    return res.redirect(this.location)
  }
}
