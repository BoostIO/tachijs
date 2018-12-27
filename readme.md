:construction: We're preparing prototype now! See https://github.com/BoostIO/tachijs/pull/1

# TachiJS (太刀)

> [Tachi https://en.wikipedia.org/wiki/Tachi](https://en.wikipedia.org/wiki/Tachi)

Highly testable dead simple web server written in Typescript

- :checkered_flag: Highly testable. (all props in `req` and `res` are injectable so you don't have to mock at all.)
- :zap: `async/await` request handler like Koa without any configurations.
- :factory: Based on expressjs. (You can benefit from using this mature library)
- :wrench: Written in Typescript.

## Why?

`Nest.js` looks nice. But its learning curve is too stiff.(TBH, I still don't know how to redirect dynamically.) Most of people probably do not need to know how `Interceptor`, `Pipe` and other things work. It might be good for some enterprize level projects.

But using raw `expressjs` is also quite painful. To test express apps, you have to use `supertest` or `chai-http` things. If you use them, you will lose debugging and error stack while testing because they send actual http request internally. Otherwise, you have to mock up all params, `req`, `res` and `next`, of RequestHandler of express.js.

To deal with the testing problem, `inversify-express-utils` could be a solution. But it does not support many decorators. To render with view engine like pug, we need to use `res.render` method. But the only solution is using `@response` decorator. It means you have to mock up `Response` in your test. So technically it is super hard to test routes rendering view engine.

Luckily, TachiJS tackles those problems. If you have other ideas, please create an issue!!

## How to use

### Basic example

```ts
import tachijs, { controller, httpGet, reqParam } from 'tachijs'

@controller('/')
class HomeController {
  @httpGet('/:id')
  async showId(@reqParams('id') id: string) {
    const data = await doSomethingAsync()

    return {
      id,
      data
    }
  }
}

const server = tachijs({
  controllers: HomeController
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
