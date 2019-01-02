import { HandlerParamSelector, handlerParam } from './handlerParam'

export function reqHeaders(paramName?: string) {
  const selector: HandlerParamSelector<any> =
    paramName == null ? req => req.headers : req => req.headers[paramName]
  return handlerParam(selector)
}
