# TachiJS

[![Build Status](https://travis-ci.com/BoostIO/tachijs.svg?branch=master)](https://travis-ci.com/BoostIO/tachijs)
[![codecov](https://codecov.io/gh/BoostIO/tachijs/branch/master/graph/badge.svg)](https://codecov.io/gh/BoostIO/tachijs)
[![NPM download](https://img.shields.io/npm/dm/tachijs.svg)](https://www.npmjs.com/package/tachijs)
[![Supported by BoostIO](https://github.com/BoostIO/boostio-materials/raw/master/v1/boostio-shield-v1.svg?sanitize=true)](https://boostio.co)

> [Tachi(太刀) https://en.wikipedia.org/wiki/Tachi](https://en.wikipedia.org/wiki/Tachi)

Highly testable dead simple web server written in Typescript

- :checkered_flag: **Highly testable.** (all props in `req` and `res` are injectable so you don't have to mock at all.)
- :wrench: **Highly customizable.**
- :syringe: **Simple dependency injection.**
- :zap: **`async/await` request handler.** (like Koa without any configurations.)
- :factory: **Based on expressjs.** (You can benefit from using this mature library)
- :white_check_mark: **Built-in request body validator.**
- :triangular_ruler: **Written in Typescript.**

## Why?

`Nest.js` looks nice. But its learning curve is too stiff.(TBH, I still don't know how to redirect dynamically.) Most of people probably do not need to know how `Interceptor`, `Pipe` and other things work. It might be good for some enterprize level projects.

But using raw `expressjs` is also quite painful. To test express apps, you have to use `supertest` or `chai-http` things. If you use them, you will lose debugging and error stack while testing because they send actual http request internally. Otherwise, you have to mock up all params, `req`, `res` and `next`, of RequestHandler of express.js.

To deal with the testing problem, `inversify-express-utils` could be a solution. But it does not support many decorators. To render with view engine like pug, we need to use `res.render` method. But the only solution is using `@response` decorator. It means you have to mock up `Response` in your test. So technically it is super hard to test routes rendering view engine.

Luckily, TachiJS tackles those problems. If you have other ideas, please create an issue!!

## How to use

### Install tachijs

```sh
npm i tachijs
```

Enable `experimentalDecorators` of `compilerOptions` to `tsconfig.json`.

```json
{
  "compilerOptions": {
    ...
    "experimentalDecorators": true,
    ...
  }
}
```

### Quick start

```ts
import tachijs, { controller, httpGet } from 'tachijs'

@controller('/')
class HomeController() {
  // Define when this method should be used.
  @httpGet('/')
  index() {
    return {
      message: 'Hello, world!'
    }
  }
}

// Register `HomeController`
const app = tachijs({
  controllers: [HomeController]
})

// `app` is just an express application instance
app.listen(8000)
```

Now you can access [http://localhost:8000/](http://localhost:8000/).

For other http methods, tachijs provides `@httpPost`, `@httpPut`, `@httpPatch`, `@httpDelete`, `@httpOptions`, `@httpHead` and `@httpAll`.

### Configuring express app(Middleware)

There are lots of ways to implement express middleware.

#### Use `before` and `after` options

```ts
import bodyParser from 'body-parser'
import { ConfigSetter, NotFoundException } from 'tachijs'

const before: ConfigSetter = app => {
  app.use(bodyParser())
}

const after: ConfigSetter = app => {
  app.use('*', (req, res, next) => {
    next(new NotFoundException('Page does not exist.'))
  })

  const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
    const { status = 500, message } = error
    res.status(status).json({
      status,
      message
    })
  }
  app.use(errorHandler)
}

const app = tachijs({
  before,
  after
})

app.listen(8000)
```

#### Without `before` or `after` options

Identically same to the above example.

```ts
import express from 'express'
import bodyParser from 'body-parser'
import { ConfigSetter, NotFoundException } from 'tachijs'

const app = express()
app.use(bodyParser())

tachijs({
  app
})

app.use('*', (req, res, next) => {
  next(new NotFoundException('Page does not exist.'))
})

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const { status = 500, message } = error
  res.status(status).json({
    status,
    message
  })
}
app.use(errorHandler)

app.listen(8000)
```

#### Apply middleware to controllers and methods

Sometimes, you might want to apply middleware to several methods only.

```ts
import { controller, httpGet, ForbiddenException } from 'tachijs'
import cors from 'cors'
import { RequestHandler } from 'express'

const onlyAdmin: RequestHandler = (req, res, next) => {
  if (!req.user.admin) {
    next(new ForbiddenException('Only admin users can access this api'))
    return
  }
  next()
}

// Apply `cors()` to controller. Now all methods will use the middleware.
@controller('/', [cors()])
class HomeController() {
  @httpGet('/')
  index() {
    return {
      message: 'Hello, world!'
    }
  }

  // Apply `onlyAdmin` to `admin` method. This middleware will be applied to this method only.
  @httpGet('/', [onlyAdmin])
  admin() {
    return {
      message: 'Hello, world!'
    }
  }
}
```

### Configure router options

Tachijs will create and register a router for each controller.

So you can provide router options via `@controller` decorator.

```ts
@controller('/:name', [], {
  // Provide mergeParams option to express router.
  mergeParams: true
})
class HomeController {
  @httpGet('/hello')
  // Now routes in the controller can access params.
  index(@reqParams('name') name: string) {
    return `Hello, ${name}`
  }
}
```

### Access `req.params`, `req.query` and `req.body` via decorators

You can access them via `@reqParams`, `@reqQuery` and `@reqBody`.
(Don't forget to apply `body-parser` middleware)

```ts
import {
  controller,
  httpGet,
  httpPost,
  reqParams,
  reqQuery,
  reqBody
} from 'tachijs'

@controller('/posts')
class PostController() {
  @httpGet('/:postId')
  // `req.params.postId`
  async show(@reqParams('postId') postId: string) {
    const post = await Post.findById(postId)

    return {
      post
    }
  }

  @httpGet('/search')
  // `req.query.title`
  async search(@reqQuery('title') title: string = '') {
    const posts = await Post.find({
      title
    })

    return {
      posts
    }
  }

  @httpPost('/')
  // `req.body` (`@reqBody` does not accept property keys.)
  async create(@reqBody() body: unknown) {
    const validatedBody = validate(body)
    const post = await Post.create({
      ...validatedBody
    })

    return {
      post
    }
  }
}
```

We also provide `reqHeaders`, `reqCookies` and `reqSession` for `req.headers`, `req.cookies` and `req.session`. To know more, see our api documentation below.

#### Body validation

It has been deprecated from v1. We'll provide this feature as a separated module.

#### Custom parameter decorators!

If you're using `passport`, you should want to access user data from `req.user`.
`@handlerParam` decorator make it possible. The decorator gets a selector which accepts express's `req`, `res` and `next`. So all you need to do is decide what to return from thoes three parameters.

```ts
import { controller, httpGet, handlerParam } from 'tachijs'

@controller('/')
class HomeController {
  @httpGet('/')
  async showId(@handlerParam((req, res, next) => req.user) user: any) {
    doSomethingWithUser(user)

    return {
      ...
    }
  }
}
```

If you want reusable code, please try like the below.

```ts
import { controller, httpGet, handlerParam } from 'tachijs'

function reqUser() {
  // You can omit other next params, `res` and `next`, if you don't need for your selector.
  return handlerParam(req => req.user)
}

@controller('/')
class HomeController {
  @httpGet('/')
  async showId(@reqUser() user: any) {
    doSomethingWithUser(user)

    return {
      ...
    }
  }
}
```

##### Bind methods of `req` or `res` before exposing

You can also pass methods of `req` or `res` which are augmented by express module.
Some of them might need the context of them.
So please bind methods before exposing like the below example.

```ts
export function cookieSetter() {
  return handlerParam((req, res) => res.cookie.bind(res))
}
```

##### `meta.paramType`

If you are using `reflect-metadata`, tachijs exposes `paramType` to the forth argument, `meta`, of `handlerParam` from `design:paramtypes`. With this feature, you could access argument types on runtime. The below example is validating and transforming query with DTO class by class-validator.

```ts
import 'reflect-metadata'
import { controller, httpGet, handlerParam } from 'tachijs'
import { IsString } from 'class-validator'
import { transformAndValidate } from 'class-transformer-validator'

function validatedQuery() {
  return handlerParam((req, res, next, meta) => {
    // Now tachijs will expose `paramType`.
    // If the param type is unknown or any, paramType will become `Object`.
    return meta.paramType !== Object
      ? transformAndValidate(meta.paramType, req.query)
      : req.query
  })
}

// Validator class
class SearchQueryDTO {
  @IsString()
  title: string
}

@controller('/')
class PostController {
  @httpGet('/search')
  // Provide the validator class to param type.
  search(@validatedQuery() query: SearchQueryDTO) {
    // Now `query` is type-safe
    // because it has been validated and transformed into an instance of SearchQueryDTO.
    // If validation errors happen, tachijs will pass the error into `next` so you can handle it easily by your error request handler.
    const { title } = query

    return {
      ...
    }
  }
}
```

To enable it, you have to install `reflect-metadata` and to apply `emitDecoratorMetadata` of `compilerOptions` to `tsconfig.json`.

```sh
npm i reflect-metadata
```

```json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true
  }
}
```

To know more, see `@handlerParam` api documentation below.

### Redirection, Rendering via pug and others...

Techinically, you don't have to access `res` to response data.
But, if you want to redirect or render page via pug, you need to access `res.redirect` or `res.render`.
Sadly, if you do, you have make mockup for `res`.

But, with tachijs, you can tackle this problem.

```ts
import { controller, httpGet, RedirectResult } from 'tachijs'

@controller('/')
class HomeController {
  @httpGet('/redirect')
  redirectToHome() {
    return new RedirectResult('/')
  }
}
```

Now, you can test your controller like the below example.

```ts
describe('HomeController#redirectToHome', () => {
  it('redirects to `/`', async () => {
    // Given
    const controller = new HomeController()

    // When
    const result = controller.redirectToHome()

    // Then
    expect(result).toBeInstanceOf(RedirectResult)
    expect(result).toMatchObject({
      location: '/'
    })
  })
})
```

There are other results too, `EndResult`, `JSONResult`, `RenderResult`, `SendFileResult`, `SendResult`, and `SendStatusResult`. Please see our api documentation below.

#### `BaseController`

If you need to use many types of result, you probably want `BaseController`.
Just import it once, and your controller can instantiate results easily.

```ts
import { controller, httpGet, BaseController } from 'tachijs'

@controller('/')
// You have to extend your controller from `BaseController`
class HomeController extends BaseController {
  @httpGet('/redirect')
  redirectToHome() {
    // This is identically same to `return new RedirectResult('/')`
    return this.redirect('/')
  }
}
```

`BaseController` has methods for all build-in results, Please see our api documentation below.

##### `BaseController#context`

You may want to share some common methods via your own base controller. But, sadly, it is not possible to use decorators to get objects from `req` or `res` and services provided by `@inject`.

To make it possible, we introduce `context`. Which expose `req`, `res` and `inject` method via `context` if your controller is extended from `BaseController`.

```ts
interface Context {
  req: express.Request
  res: express.Response
  inject<S>(key: string): S
}
```

```ts
import { BaseController, controller, httpPost } from 'tachijs'

class MyBaseController extends BaseController {
  async getUserConfig() {
    // When unit testing, `context` is not defined.
    if (this.context == null) {
      return new UserConfig()
    }

    const { req, inject } = this.context

    // Now we can get the current user from `req`
    const currentUser = req.user

    // And inject any services from the container.
    const userConfigService = inject<UserConfigService>(
      ServiceTypes.UserConfigService
    )

    return userConfigService.findByUserId(userId)
  }
}

@controller('/')
class HomeController {
  @httpGet('/settings')
  settings() {
    const userConfig = await this.getUserConfig()

    return this.render('settings', {
      userConfig
    })
  }
}
```

#### Customize result

If you want to have customized result behavior, you can do it with `BaseResult`.
`BaseResult` is an abstract class which coerce you to define how to end the route by providing `execute` method.
(Every built-in result is extended from `BaseResult`.)

Let's see our implementation of `RedirectResult`.

```ts
import express from 'express'
import { BaseResult } from './BaseResult'

export class RedirectResult extends BaseResult {
  constructor(
    public readonly location: string,
    public readonly status?: number
  ) {
    super()
  }

  // tachijs will provide all what you need and execute this method.
  async execute(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    if (this.status != null) return res.redirect(this.status, this.location)
    return res.redirect(this.location)
  }
}
```

#### Dependency injection

To make controllers more testable, tachijs provides dependency injection.

Let's think we have some mailing service, `MailerService`.
While developing or testing, we probably don't want our server to send real e-mail everytime.

```ts
import tachijs, {
  controller,
  httpGet,
  httpPost,
  reqBody,
  inject,
  BaseController
} from 'tachijs'

// Create enum for service types
enum ServiceTypes {
  EmailService = 'EmailService',
  NotificationService = 'NotificationService'
}

// Abstract class coerce MailerService must have `sendEmail` method.
abstract class MailerService {
  abstract sendEmail(content: string): Promise<void>
}

// Mockup service for development and testing.
class MockEmailService extends MailerService {
  async sendEmail(content: string) {
    console.log(`Not sending email.... content: ${content}`)
  }
}

class EmailService extends MailerService {
  async sendEmail(content: string) {
    console.log(`Sending email.... content: ${content}`)
  }
}

interface Container {
  [ServiceTypes.EmailService]: typeof MailerService
}

const envIsDev = process.env.NODE_ENV === 'development'

// Swapping container depends on the current environment.
const container: Container = envIsDev
  ? {
      // In development env, don't send real e-mail because we use mockup.
      [ServiceTypes.EmailService]: MockEmailService
    }
  : {
      [ServiceTypes.EmailService]: EmailService
    }

@controller('/')
class HomeController extends BaseController {
  constructor(
    // Inject MailerService. The controller will get the one registered to the current container.
    @inject(ServiceTypes.EmailService) private mailer: MailerService
  ) {
    super()
  }

  @httpGet('/')
  home() {
    return `<form action='/notify' method='post'><input type='text' name='message'><button>Notify</button></form>`
  }

  @httpPost('/email')
  async sendEmail(@reqBody() body: any) {
    await this.mailer.sendEmail(body.message)

    return this.redirect('/')
  }
}

const server = tachijs({
  controllers: [HomeController],
  // Register container
  container
})
```

So you can test `HomeController#sendEmail` like the below example.

```ts
describe('HomeController#sendEmail', () => {
  it('sends email', async () => {
    // Given
    const spyFn = jest.fn()
    class TestEmailService extends MailerService {
      async sendEmail(content: string): Promise<void> {
        spyFn(content)
      }
    }
    const controller = new HomeController(new TestEmailService())

    // When
    const result = controller.sendEmail('hello')

    // Then
    expect(spyFn).toBeCalledWith('hello')
  })
})
```

Now we don't have to worry that our controller sending e-mail for each testing.

Furthermore, you can inject other services to your service as long as they exist in the container.

```ts
class NotificationService {
  constructor(
    // When NotificationService is instantiated, MailerService will be instantiated also by tachijs.
    @inject(ServiceTypes.EmailService) private mailer: MailerService
  ) {}

  async notifyWelcome() {
    await this.mailer.sendEmail('Welcome!')
  }
}
```

##### DI without `tachijs`

When some testing or just writing scripts using services, you might want to use DI without `tachijs` function.
So we exposed `Injector` class which is used by `tachijs`.

```ts
enum ServiceTypes {
  NameService = 'NameService',
  MyService = 'MyService'
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
  [ServiceTypes.NameService]: NameService,
  [ServiceTypes.MyService]: MyService
}

// Create injector
const injector = new Injector(container)

// Instantiate by a key
const myService = injector.inject<MyService>(ServiceTypes.MyService)
// Instantiate by a constructor
const myService = injector.instantiate(MyService)
```

### Bad practices

Please check this section too to keep your controllers testable.

#### Execute `res.send` or `next` inside of controllers or `@handlerParam`

Please don't do that. It just make your controller untestable. If you want some special behaviors after your methods are executed, please try to implement them with `BaseResult`.

**Do**

```ts
class HelloResult extends BaseResult {
  async execute(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    res.send('Hello')
  }
}

class HomePageController extends BaseController {
  @httpGet('/')
  index() {
    // Now we can test it by just checking the method returns an instance of `HelloResult`.
    return new HelloResult()
  }
}
```

**Don't**

```ts
class HomePageController {
  @httpGet('/')
  index(@handlerParam((req, res) => res) res: expressResponse) {
    // We have to make mock-up for express.Response to test
    res.send('Hello')
  }
}
```

#### Access `BaseController#context` in your descendant controllers

It is designed to be used inside of your base controller to make unit testing easy.

**Do**

```ts
class MyBaseController extends BaseController {
  doSomethingWithContext() {
    if (this.context == null) {
      // on unit testing
      return
    }
    // on live
  }
}
```

**Don't**

```ts
class HomePageController extends MyBaseController {
  @httpGet('/')
  index() {
    // We have to make mock-up everything to test
    this.context!.req....
  }
}
```

## APIs

### `tachijs(options: TachiJSOptions): express.Application`

Create and configure an express app.

#### `TachiJSOptions`

```ts
interface TachiJSOptions<C = {}> {
  app?: express.Application
  before?: ConfigSetter
  after?: ConfigSetter
  controllers?: any[]
  container?: C
}

type ConfigSetter = (app: express.Application) => void
```

- `app` Optional. If you provide this option, tachijs will use it rather than creating new one.
- `before` Optional. You can configure express app before registering controllers for applying middleware.
- `after` Optional. You can configure express app before registering controllers for error handling.
- `controllers` Optional. Array of controller classes.
- `container` Optional. A place for registered services.
  If you want to use DI, you have to register services to here first.

### `@controller(path: string, middleware: MiddlewareParams | RequestHandler[] = {}, routerOptions: RouterOptions = {})`

It marks class as a controller.

- `path` Target path.
- `middleware` Optional. `MiddlewareParams` or Array of middleware.
  If it provided as array, tachijs will set the middleware before controller method.
- `routerOptions` Optional. Express router options.

#### `MiddlewareParams`

```ts
interface MiddlewareParams {
  before?: RequestHandler[]
  after?: RequestHandler[]
}
```

### `@httpMethod(method: string, path: string, middleware: MiddlewareParams | RequestHandler[] = {})`

It marks method as a request handler.

- `method` Target http methods, `'get'`, `'post'`, `'put'`, `'patch'`, `'delete'`, `'options'`, `'head'` or `'all'` are available. (`'all'` means any methods.)
- `path` Target path.
- `middleware` Optional. `MiddlewareParams` or Array of middleware.
  If it provided as array, tachijs will set the middleware before controller method.

tachijs also provides shortcuts for `@httpMethod`.

- `@httpGet(path: string, middleware: MiddlewareParams | RequestHandler[] = {})`
- `@httpPost(path: string, middleware: MiddlewareParams | RequestHandler[] = {})`
- `@httpPut(path: string, middleware: MiddlewareParams | RequestHandler[] = {})`
- `@httpPatch(path: string, middleware: MiddlewareParams | RequestHandler[] = {})`
- `@httpDelete(path: string, middleware: MiddlewareParams | RequestHandler[] = {})`
- `@httpOptions(path: string, middleware: MiddlewareParams | RequestHandler[] = {})`
- `@httpHead(path: string, middleware: MiddlewareParams | RequestHandler[] = {})`
- `@httpAll(path: string, middleware: MiddlewareParams | RequestHandler[] = {})`

### `@handlerParam<T>(selector: HandlerParamSelector<T>)`

- `selector` selects a property from `req`, `res`, `next` or even our `meta`

```ts
export type HandlerParamSelector<T> = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
  meta: HandlerParamMeta<T>
) => T
```

```ts
interface HandlerParamMeta<T> {
  index: number
  selector: HandlerParamSelector<T>
  paramType?: any
}
```

- `index` Number index of the parameter.
- `selector` Its selector.
- `paramType` metadata from `design:paramtypes`.

#### `@reqBody()`

Inject `req.body`.

```ts
import { controller, httpPost, reqBody } from 'tachijs'

@controller('/post')
class PostController {
  @httpPost('/')
  create(@reqBody() post: any) {
    ...
  }
}
```

#### `@reqParams(paramName?: string)`

Inject `req.params` or its property.

- `paramName` If it is given, `req.params[paramName]` will be injected.

#### `@reqQuery(paramName?: string)`

Inject `req.query` or its property.

- `paramName` If it is given, `req.query[paramName]` will be injected.

#### `@reqHeaders(paramName?: string)`

Inject `req.headers` or its property.

- `paramName` If it is given, `req.headers[paramName]` will be injected.

#### `@reqCookies(paramName?: string)`

Inject `req.cookies` or its property.

- `paramName` If it is given, `req.cookies[paramName]` will be injected.

#### `@reqSignedCookies(paramName?: string)`

Inject `req.signedCookies` or its property.

- `paramName` If it is given, `req.signedCookies[paramName]` will be injected.

#### `@cookieSetter()`

Inject `res.cookie` method to set cookie.

#### `@cookieClearer()`

Inject `res.clearCookie` method to clear cookie.

#### `@reqSession(paramName?: string)`

Inject `req.session`.

### `BaseController`

A base for controller which have lots of helper methods for returning built-in results. Also, it allows another way to access properties of `req`, `res` and `inject` without any decorators.

- `#context` tachijs will set `req`, `res` and `inject` method to this property. So, when unit testing, it is not defined.
  - `#context.req` Raw express request instance
  - `#context.req` Raw express response instance
  - `#inject<S>(key: string): S` A method to access a registered service by the given key. It is almost same to `@inject` decorator. (`@inject<ServiceTypes.SomeService> someService: SomeService` => `const someService = this.inject<SomeService>(ServiceTypes.SomeService)`)
- `#end(data: any, encoding?: string, status?: number): EndResult`
- `#json(data: any, status?: number): JSONResult`
- `#redirect(location: string, status?: number): RedirectResult`
- `#render(view: string, locals?: any, callback?: RenderResultCallback, status?: number): RenderResult`
- `#sendFile(filePath: string, options?: any, callback?: SendFileResultCallback, status?: number): SendFileResult`
- `#send(data: any, status?: number): SendResult`
- `#sendStatus(status: number): SendStatusResult`

### Results

#### `BaseResult`

All of result classes must be extended from `BaseResult` because tachijs can recognize results by `instanceof BaseResult`.

It has only one abstract method which must be defined by descendant classes.

- `execute(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>` tachijs will use this method to finalize response.

#### `new EndResult(data: any, encoding?: string, status: number = 200)`

tachijs will finalize response with `res.status(status).end(data, encoding)`.

#### `new JSONResult(data: any, status: number = 200)`

tachijs will finalize response with `res.status(status).json(data)`.

#### `new NextResult(error?: any)`

tachijs will finalize response with `next(error)`.

#### `new RedirectResult(location: string, status?: number)`

tachijs will finalize response with `res.redirect(location)` (or `res.redirect(status, location)` if the status is given).

#### `new RenderResult(view: string, locals?: any, callback?: RenderResultCallback, status: number = 200)`

tachijs will finalize response with `res.status(status).render(view, locals, (error, html) => callback(error, html, req, res, next))`

```ts
type RenderResultCallback = (
  error: Error | null,
  html: string | null,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => void
```

#### `new SendFileResult(filePath: string, options: any, callback?: SendFileResultCallback, status: number = 200)`

tachijs will finalize response with `res.status(status).sendFile(filePath, options, (error) => callback(error, req, res, next))`

```ts
type SendFileResultCallback = (
  error: Error | null,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => void
```

#### `new SendResult(data: any, status: number = 200)`

tachijs will finalize response with `res.status(status).send(data)`.

#### `new SendStatusResult(status: number)`

tachijs will finalize response with `res.sendStatus(status)`.

### `@inject(key: string)`

Inject a registered service in container by the given `key`.

### `class Injector`

#### `new Injector<C>(container: C)`

Instantiate an injector with container

#### `#instantiate(Constructor: any): any`

Instantiate a service constructor. If the constructor has injected services, this method instantiate and inject them by `#inject` method.

#### `#inject<S = any>(key: string): S`

Instantiate a service by a key from Container. If there is no service for the given key, it will throws an error.

## License

MIT © Junyoung Choi
