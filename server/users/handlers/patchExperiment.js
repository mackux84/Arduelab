'use strict'

const Boom        = require('boom')
const Experiment = require('../models/Experiment')

module.exports = function (request, reply) {
  const id = request.params.id
  Experiment
    .findOneAndUpdate({ _id: id }, request.payload, (error, experiment) => {
      if (error) {
        reply(Boom.badRequest(error))
        return
      }
      if (!experiment) {
        reply(Boom.notFound('Experiment id=(' + request.params.id + ') not found!'))
        return
      }
      reply({message: 'Experiment updated!'})
    })
}