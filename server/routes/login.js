'use strict'

module.exports = [
    {
    method: 'GET',
    path: '/login',
    config: {},
    handler: function (request, reply) {
      reply.view('login.html')
    }
  }
]
