const Hapi = require('@hapi/hapi')

const { serverConfig } = require('./config')
const { workerService } = require('./services')
const routes = require('./routes')

const init = async () => {
  const test = 5
  const server = Hapi.server({
    port: serverConfig.port,
    host: serverConfig.host,
    routes: {
      cors: { origin: ['*'] }
    },
    debug: { request: ['handler'] }
  })

  server.route(routes)
  await server.start()
  console.log(`🚀 Server ready at ${server.info.uri}`)
  server.table().forEach(route => console.log(`${route.method}\t${route.path}`))
  workerService.init()
}

process.on('uncaughtException', (err, origin) => {
  console.log('Uncaught Exception:', err, 'Exception origin:', origin)
})

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection:', promise, 'reason:', reason)
})

init()
