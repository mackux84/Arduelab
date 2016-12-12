'use strict'

module.exports = [
    {
    method: 'GET',
    path: '/admin',
    config: {},
    handler: function (request, reply) {
      reply.view('admin.html')
    }
  }
]
