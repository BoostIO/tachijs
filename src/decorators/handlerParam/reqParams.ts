import { HandlerParamSelector, handlerParam } from './handlerParam'

export function reqParams(paramName?: string) {
  const selector: HandlerParamSelector<any> =
    paramName == null ? req => req.params : req => req.params[paramName]
  return handlerParam(selector)
}
