import { HandlerParamSelector, handlerParam } from './handlerParam'
import { transformAndValidate } from 'class-transformer-validator'

export function reqBody(validator?: any) {
  const selector: HandlerParamSelector<any> =
    validator == null
      ? req => req.body
      : req => transformAndValidate(validator, req.body)
  return handlerParam(selector)
}
