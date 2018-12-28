import { inject } from '../../index'
import { ServiceTypes } from '../services/types'
import { ChildService } from './ChildService'

export class MyService {
  constructor(@inject(ServiceTypes.ChildService) private child: ChildService) {}

  do() {
    console.log('MyService#do executed!!')
    this.child.do()
  }
}
