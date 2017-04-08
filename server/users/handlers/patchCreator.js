'use strict'

const Boom        = require('boom')
const Creator        = require('../models/Creator')

module.exports = function (request, reply) {
  const id = request.params.id
  Creator
    .findOneAndUpdate({ _id: id }, request.pre.creator, (error, creator) => {
      if (error) {
        reply(Boom.badRequest(error))
        return
      }
      if (!creator) {
        reply(Boom.notFound('Creator id=(' + request.params.id + ') not found!'))
        return
      }
      reply({message: 'Creator updated!'})
    })
}