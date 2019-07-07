import express from 'express'
import { BaseResult } from './BaseResult'

export type RenderResultCallback = (
  error: Error | null,
  html: string | null,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => void

export class RenderResult<L extends {}> extends BaseResult {
  constructor(
    public readonly view: string,
    public readonly locals?: L,
    public readonly callback?: RenderResultCallback,
    public readonly status: number = 200
  ) {
    super()
  }

  async execute(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (this.callback != null) {
      const callback = this.callback
      return res
        .status(this.status)
        .render(
          this.view,
          this.locals,
          (error: Error | null, html: string | null) =>
            callback(error, html, req, res, next)
        )
    }
    return res.status(this.status).render(this.view, this.locals)
  }
}
