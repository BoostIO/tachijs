import { HandlerParamSelector, handlerParam } from './handlerParam'

export function reqQuery(paramName?: string) {
  const selector: HandlerParamSelector<any> =
    paramName == null ? req => req.query : req => req.query[paramName]
  return handlerParam(selector)
}
