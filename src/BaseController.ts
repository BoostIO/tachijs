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
import { OutgoingHttpHeaders } from 'http'

interface HttpContext {
  req: express.Request
  res: express.Response
}

interface Context {
  req: express.Request
  res: express.Response
  inject<S>(key: string): S
}

export class BaseController {
  context?: Context

  /* istanbul ignore next */
  get httpContext(): HttpContext | undefined {
    // tslint:disable-next-line:no-console
    console.warn(
      'BaseController#httpContext will be deprecated from v1.0.0. Please use BaseController#context.'
    )
    if (this.context == null) return
    return {
      req: this.context.req,
      res: this.context.res
    }
  }

  /* istanbul ignore next */
  get injector(): ((key: string) => any) | undefined {
    // tslint:disable-next-line:no-console
    console.warn(
      'BaseController#injector will be deprecated from v1.0.0. Please use BaseController#context.inject.'
    )
    if (this.context == null) return
    return this.context.inject
  }

  /* istanbul ignore next */
  set injector(injector: ((key: string) => any) | undefined) {
    // tslint:disable-next-line:no-console
    console.warn(
      'BaseController#injector will be deprecated from v1.0.0. Please use BaseController#context.inject.'
    )
    if (this.context != null && injector != null) {
      this.context.inject = injector
    }
  }

  /* istanbul ignore next */
  inject<S>(key: string): S {
    // tslint:disable-next-line:no-console
    console.warn(
      'BaseController#inject will be deprecated from v1.0.0. Please use BaseController#context.inject.'
    )
    if (this.injector == null) throw new Error('Injector is not set.')
    return this.injector(key)
  }

  end<D>(
    data: D,
    encoding?: string,
    status?: number,
    headers?: OutgoingHttpHeaders
  ): EndResult<D> {
    return new EndResult(data, encoding, status, headers)
  }

  json<D>(
    data: D,
    status?: number,
    headers?: OutgoingHttpHeaders
  ): JSONResult<D> {
    return new JSONResult(data, status)
  }

  redirect(location: string, status?: number, headers?: OutgoingHttpHeaders) {
    return new RedirectResult(location, status, headers)
  }

  render<D>(
    view: string,
    locals?: D,
    callback?: RenderResultCallback,
    status?: number,
    headers?: OutgoingHttpHeaders
  ): RenderResult<D> {
    return new RenderResult(view, locals, callback, status, headers)
  }

  sendFile(
    filePath: string,
    options?: any,
    callback?: SendFileResultCallback,
    status?: number,
    headers?: OutgoingHttpHeaders
  ) {
    return new SendFileResult(filePath, options, callback, status, headers)
  }

  send<D>(
    data: D,
    status?: number,
    headers?: OutgoingHttpHeaders
  ): SendResult<D> {
    return new SendResult(data, status, headers)
  }

  sendStatus(status: number, headers?: OutgoingHttpHeaders) {
    return new SendStatusResult(status, headers)
  }
}
