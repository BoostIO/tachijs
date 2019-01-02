import { handlerParam } from './handlerParam'

export function reqSession() {
  return handlerParam(req => req.session)
}
