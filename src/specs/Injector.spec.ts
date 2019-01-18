import { inject, Injector } from '../index'

describe('Injector', () => {
  describe('#instantiate', () => {
    it('instantiates a Constructor', async () => {
      // Given
      enum ServiceTypes {
        NameService = 'NameService'
      }
      class NameService {
        getName() {
          return 'Test'
        }
      }
      class MyService {
        constructor(
          @inject(ServiceTypes.NameService) private nameService: NameService
        ) {}

        sayHello() {
          return `Hello, ${this.nameService.getName()}`
        }
      }
      const container = {
        [ServiceTypes.NameService]: NameService
      }
      const injector = new Injector(container)

      // When
      const myService = injector.instantiate(MyService)
      const result = myService.sayHello()

      // Then
      expect(myService).toBeInstanceOf(MyService)
      expect(result).toBe('Hello, Test')
    })

    it('throws if injected service does not exist.', async () => {
      // Given
      enum ServiceTypes {
        NameService = 'NameService'
      }
      class NameService {
        getName() {
          return 'Test'
        }
      }
      class MyService {
        constructor(
          @inject(ServiceTypes.NameService) private nameService: NameService
        ) {}

        sayHello() {
          return `Hello, ${this.nameService.getName()}`
        }
      }
      const container = {}
      const injector = new Injector(container)
      expect.assertions(1)

      // When
      try {
        injector.instantiate(MyService)
      } catch (error) {
        // Then
        expect(error).toMatchObject({
          message:
            'No service is registered for "NameService" key. (While instantiating "MyService")'
        })
      }
    })
  })

  describe('#inject', async () => {
    it('instantiates a constructor by the given key from container', () => {
      // Given
      enum ServiceTypes {
        MyService = 'MyService'
      }
      class MyService {
        sayHello() {
          return 'Hello'
        }
      }
      const container = {
        [ServiceTypes.MyService]: MyService
      }
      const injector = new Injector(container)

      // When
      const myService = injector.inject(ServiceTypes.MyService)

      // Then
      expect(myService).toBeInstanceOf(MyService)
    })
    it('throws if no service is regisered to container for the given key', () => {
      // Given
      enum ServiceTypes {
        MyService = 'MyService',
        UnregisteredService = 'UnregisteredService'
      }
      class MyService {
        sayHello() {
          return 'Hello'
        }
      }
      const container = {
        [ServiceTypes.MyService]: MyService
      }
      const injector = new Injector(container)
      expect.assertions(1)

      try {
        // When
        injector.inject(ServiceTypes.UnregisteredService)
      } catch (error) {
        // Then
        expect(error).toMatchObject({
          message: 'No service is registered for "UnregisteredService" key.'
        })
      }
    })
  })
})
