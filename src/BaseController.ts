import express from 'express'
import {
  EndResult,
  JSONResult,
  RedirectResult,
  RenderResult,
  SendFileResult,
  SendResult,
  SendStatusResult,
  RenderResultCallback,
  SendFileResultCallback
} from './results'

interface Context {
  req: express.Request
  res: express.Response
  inject<S>(key: string): S
}

export class BaseController {
  context?: Context

  end<D>(data: D, encoding?: string, status?: number): EndResult<D> {
    return new EndResult(data, encoding, status)
  }

  json<D>(data: D, status?: number): JSONResult<D> {
    return new JSONResult(data, status)
  }

  redirect(location: string, status?: number) {
    return new RedirectResult(location, status)
  }

  render<D>(
    view: string,
    locals?: D,
    callback?: RenderResultCallback,
    status?: number
  ): RenderResult<D> {
    return new RenderResult(view, locals, callback, status)
  }

  sendFile(
    filePath: string,
    options?: any,
    callback?: SendFileResultCallback,
    status?: number
  ) {
    return new SendFileResult(filePath, options, callback, status)
  }

  send<D>(data: D, status?: number): SendResult<D> {
    return new SendResult(data, status)
  }

  sendStatus(status: number) {
    return new SendStatusResult(status)
  }
}
