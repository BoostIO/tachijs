import { handlerParam } from './handlerParam'
import { transformAndValidate } from 'class-transformer-validator'

export function reqBody(validator?: any) {
  const validatorIsGiven = validator != null
  if (validatorIsGiven) {
    return handlerParam(req => transformAndValidate(validator, req.body))
  }
  return handlerParam((req, res, next, meta) => {
    return meta.paramType !== Object
      ? transformAndValidate(meta.paramType, req.body)
      : req.body
  })
}
