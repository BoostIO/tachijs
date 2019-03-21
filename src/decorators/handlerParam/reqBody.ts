import { handlerParam } from './handlerParam'

export function reqBody() {
  return handlerParam(req => {
    return req.body
  })
}
