import express from 'express'
import { BaseResult } from './BaseResult'
import { OutgoingHttpHeaders } from 'http'

export type SendFileResultCallback = (
  error: Error | null,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => void

export class SendFileResult extends BaseResult {
  constructor(
    public readonly filePath: string,
    public readonly options: any = {},
    public readonly callback?: SendFileResultCallback,
    public readonly status: number = 200,
    public readonly headers?: OutgoingHttpHeaders
  ) {
    super()
  }

  async execute(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (this.headers != null) {
      res.set(this.headers)
    }
    if (this.callback != null) {
      const callback = this.callback
      return res
        .status(this.status)
        .sendFile(this.filePath, this.options, (error: Error) =>
          callback(error, req, res, next)
        )
    }
    return res.status(this.status).sendFile(this.filePath, this.options)
  }
}
