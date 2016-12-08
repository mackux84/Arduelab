'use strict'

const Boom = require('boom')
const Experiment = require('../models/Experiment')

module.exports = function (request, reply) {
  let experiment = new Experiment()
  experiment.name = request.payload.name
  experiment.university = request.payload.university
  experiment.url = request.payload.url
  experiment.schedule = request.payload.schedule
  experiment.duration = request.payload.duration
  experiment.enabled = request.payload.enabled

  experiment.save((error, experiment) => {
    if (!error) {
      reply({ message: 'Experiment created successfully' })
    } else {
      console.log(error)
      reply(Boom.forbidden(error))
    }
  })
}