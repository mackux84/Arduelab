'use strict'

const Hapi            = require('hapi')
const Path            = require('path')
const auth            = require('./server/config/auth')
require('./server/users/user-db').db // without this the db is never connected (can be called from any module)
const goodOptions     = require('./server/config/goodOptions')
const swagger_options = require('./server/config/swaggerOptions')

const server = new Hapi.Server({
  debug: {
    request: ['error']
  },
  connections: {
    router: {
      isCaseSensitive: true, // deffault
      stripTrailingSlash: true // NOT deffault
    }
  }
})

server.connection({
  port: auth.server.port,
  host: auth.server.host
})

server.register(
  [
    require('hapi-auth-jwt2')
  ],
  function (err) {
    if (err) {
      throw err // handle plugin startup error
    }
  }
)
server.auth.strategy.apply(null, auth.jws) // jws
// must register the auth strategy before using it in swagger
server.register(
  [
    require('vision'),
    require('inert'),
    require('nes'),
    { register: require('good'), goodOptions },
    { register: require('hapi-swagger'), options: swagger_options },
    { register: require('blipp'), options: { showAuth: true } },
    { register: require('hapijs-status-monitor') },
  ],
  function (err) {
    if (err) {
      throw err // handle plugin startup error
    }
  }
)

server.views({
  engines: { html: require('hapi-dust') },
  relativeTo: Path.join(__dirname),
  path: 'client/templates',
  //partialsPath: 'client/templates',
// helpersPath: 'client/templates',
})

const routes = require('./server/routes/')
server.route(routes)


// WS Subscriptions
server.subscription('/item/{id}')

server.ext('onPreResponse', (request, reply) => {
  if (request.response.isBoom) {
    if (request.headers.accept) {
      if (request.headers.accept.indexOf('application/json') === -1) {
        const err = request.response
        const errName = err.output.payload.error
        const errMessage = err.output.payload.message
        const statusCode = err.output.payload.statusCode
        if (statusCode === 401) {
          return reply.redirect('/login')
        }
        return reply.view('error', {
          statusCode: statusCode,
          errName: errName,
          errMessage:errMessage
        }).code(statusCode)
      }
    }
  }
  reply.continue()
})

// Start the server
server.start((err) => {
  if (err) {
    console.log(err)
    throw err
  }
  console.log('Server running at:', server.info.uri)
  
})

module.exports = {
  //exports for websockets to work
  server: server
} 
