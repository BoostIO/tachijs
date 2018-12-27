:construction: We're preparing prototype now! See https://github.com/BoostIO/boostio/pull/1

# Boostio

Highly testable dead simple web server written in Typescript

- :checkered_flag: Highly testable. (all props in `req` and `res` are injectable so you don't have to mock at all.)
- :zap: `async/await` request handler like Koa without any configurations.
- :factory: Based on expressjs. (You can use all good things of the mature libary, express.js)
- :wrench: Written in Typescript.

## Why?

`Nest.js` looks nice. But its learning curve is too stiff.(TBH, I still don't know how to redirect dynamically.) Most of people probably do not need to know how `Interceptor`, `Pipe` and other things work. It might be good for some enterprize level projects.

But using raw `expressjs` is also quite painful. To test express apps, you have to use `supertest` or `chai-http` things. If you use them, you will lose debugging and error stack while testing because they send actual http request internally. Otherwise, you have to mock up all params, `req`, `res` and `next`, of RequestHandler of express.js.

To deal with the testing problem, `inversify-express-utils` could be a solution. But it does not support many decorators. To render with view engine like pug, we need to use `res.render` method. But the only solution is using `@response` decorator. It means you have to mock up `Response` in your test. So technically it is super hard to test routes rendering view engine.

Luckily, Boostio tackles those problems. If you have other ideas, please create an issue!!

## How to use

```ts
import boostio, { controller, httpGet, reqParam } from 'boostio'

@controller('/')
class HomeController {
  @httpGet('/:id')
  async showId(@reqParam('id') id: string) {
    const data = await doSomethingAsync()

    return {
      id,
      data
    }
  }
}

const server = boostio({
  controllers: HomeController
})

server.listen(8000)
```

## License

MIT © Junyoung Choi
