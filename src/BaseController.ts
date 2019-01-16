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

interface HttpContext {
  req: express.Request
  res: express.Response
}

export class BaseController {
  httpContext?: HttpContext
  injector: (type: string) => any

  inject<S>(type: string): S {
    if (this.injector == null) throw new Error('Injector is not set.')
    return this.injector(type)
  }

  end(data: any, encoding?: string, status?: number) {
    return new EndResult(data, encoding, status)
  }

  json(data: any, status?: number) {
    return new JSONResult(data, status)
  }

  redirect(location: string, status?: number) {
    return new RedirectResult(location, status)
  }

  render(
    view: string,
    locals?: any,
    callback?: RenderResultCallback,
    status?: number
  ) {
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

  send(data: any, status?: number) {
    return new SendResult(data, status)
  }

  sendStatus(status: number) {
    return new SendStatusResult(status)
  }
}
