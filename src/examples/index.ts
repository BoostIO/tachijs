import 'reflect-metadata'
import boostio from '../index'
import HomePageController from './HomePageController'

const server = boostio({
  controllers: [HomePageController]
})
server.listen(8000)
