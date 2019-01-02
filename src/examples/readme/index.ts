// tslint:disable:no-console
import 'reflect-metadata' // You have to import this to enable decorators.
import tachijs, {
  controller,
  httpGet,
  httpPost,
  reqParams,
  reqBody,
  inject,
  BaseController
} from '../../'

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
