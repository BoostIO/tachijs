# TachiJS

[![Build Status](https://travis-ci.com/BoostIO/tachijs.svg?branch=master)](https://travis-ci.com/BoostIO/tachijs)

> [Tachi(太刀) https://en.wikipedia.org/wiki/Tachi](https://en.wikipedia.org/wiki/Tachi)

Highly testable dead simple web server written in Typescript

- :checkered_flag: Highly testable. (all props in `req` and `res` are injectable so you don't have to mock at all.)
- :syringe: Simple dependency injection.
- :zap: `async/await` request handler like Koa without any configurations.
- :factory: Based on expressjs. (You can benefit from using this mature library)
- :wrench: Written in Typescript.

## Why?

`Nest.js` looks nice. But its learning curve is too stiff.(TBH, I still don't know how to redirect dynamically.) Most of people probably do not need to know how `Interceptor`, `Pipe` and other things work. It might be good for some enterprize level projects.

But using raw `expressjs` is also quite painful. To test express apps, you have to use `supertest` or `chai-http` things. If you use them, you will lose debugging and error stack while testing because they send actual http request internally. Otherwise, you have to mock up all params, `req`, `res` and `next`, of RequestHandler of express.js.

To deal with the testing problem, `inversify-express-utils` could be a solution. But it does not support many decorators. To render with view engine like pug, we need to use `res.render` method. But the only solution is using `@response` decorator. It means you have to mock up `Response` in your test. So technically it is super hard to test routes rendering view engine.

Luckily, TachiJS tackles those problems. If you have other ideas, please create an issue!!

## How to use

### Installation

```sh
npm i tachijs reflect-metadata
```

### Basic example

```ts
import 'reflect-metadata' // You have to import this to enable decorators.
import tachijs, {
  controller,
  httpGet,
  httpPost,
  reqParams,
  reqBody,
  inject,
  BaseController
} from 'tachijs'

enum ServiceTypes {
  EmailService = 'EmailService',
  NotificationService = 'NotificationService'
}

abstract class MailerService {
  abstract sendEmail(): Promise<void>
}

class MockEmailService extends MailerService {
  async sendEmail() {
    console.log('Not sending email....')
  }
}

class EmailService extends MailerService {
  async sendEmail() {
    console.log('Sending email...')
  }
}

// Any classes can be injected other class.
class NotificationService {
  constructor(
    // When NotificationService instantiate, MailerService will also instantiate.
    @inject(ServiceTypes.EmailService) private mailer: MailerService
  ) {}

  async notifySometing() {
    this.mailer.sendEmail()
  }
}

@controller('/')
class HomeController extends BaseController {
  constructor(
    @inject(ServiceTypes.NotificationService)
    private notifier: NotificationService
  ) {
    super()
  }

  @httpGet('/')
  home() {
    return `<form action='/notify' method='post'><button>Notify</button></form>`
  }

  @httpGet('/posts/:id')
  async showId(@reqParams('id') id: string) {
    return {
      id
    }
  }

  @httpPost('/notify')
  async notify(@reqBody() body: any) {
    await this.notifier.notifySometing()

    return this.redirect('/')
  }
}

// All services should be registered to container for each service type
interface Container {
  [ServiceTypes.EmailService]: typeof MailerService
  [ServiceTypes.NotificationService]: typeof NotificationService
}

const envIsDev = process.env.NODE_ENV === 'development'

// You can easily switch any services depending on environment
const container: Container = envIsDev
  ? {
      // In development env, don't send real mail
      [ServiceTypes.EmailService]: MockEmailService,
      [ServiceTypes.NotificationService]: NotificationService
    }
  : {
      [ServiceTypes.EmailService]: EmailService,
      [ServiceTypes.NotificationService]: NotificationService
    }

// Register controllers and container
const server = tachijs({
  controllers: [HomeController],
  container
})

server.listen(8000)
```

### Custom parameter decorators

If you're using `express-session`, you shyould want to access Session data from `req.session`.
`@handlerParam` decorator make it possible. The decorator gets a selector which accepts `req`, `res` and `next`. So all you need to do is decide what to return from thoes three parameters.

```ts
import { controller, httpGet, handlerParam } from 'tachijs'

@controller('/')
class HomeController {
  @httpGet('/')
  async showId(@handlerParam((req, res, next) => req.session) session: any) {
    doSomethingWithSession(session)

    return {
      ...
    }
  }
}
```

If you want reusable code, please try like the below.

```ts
import { controller, httpGet, handlerParam } from 'tachijs'

function reqSession() {
  // You can omit other next params, `res` and `next`, if you don't need for your selector.
  return handlerParam(req => req.session)
}

@controller('/')
class HomeController {
  @httpGet('/')
  async showId(@reqSession() session: any) {
    doSomethingWithSession(session)

    return {
      ...
    }
  }
}
```

## License

MIT © Junyoung Choi
