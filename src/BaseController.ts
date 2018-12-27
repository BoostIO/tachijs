import {
  EndResult,
  JSONResult,
  RedirectResult,
  RenderResult,
  SendFileResult,
  SendResult,
  SendStatusResult
} from './results'
import { RenderResultCallback, SendFileResultCallback } from './results'

export class BaseController {
  end(data: any, encoding: string, status?: number) {
    return new EndResult(data, encoding, status)
  }

  json(data: any, status?: number) {
    return new JSONResult(data, status)
  }

  redirect(location: string) {
    return new RedirectResult(location)
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

  sendStatusResult(status: number) {
    return new SendStatusResult(status)
  }
}
