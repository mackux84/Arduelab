'use strict'

const Boom        = require('boom')
const Reserve = require('../models/Reserve')

module.exports = function (request, reply) {
  const id = request.params.id
  Reserve
    .findOneAndUpdate({ _id: id }, {enabled:request.payload.enabled}, (error, user) => {
      if (error) {
        reply(Boom.badRequest(error))
        return
      }
      if (!user) {
        reply(Boom.notFound('Reserve id=(' + request.params.id + ') not found!'))
        return
      }
      reply({message: 'Reserve updated!'})
    })
}