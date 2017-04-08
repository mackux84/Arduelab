'use strict'

const Boom = require('boom')
const Experiment = require('../models/Experiment')

module.exports = function (request, reply) {
  let experiment         = new Experiment()
  experiment.name        = request.payload.name
  experiment.university  = request.payload.university
  experiment.city        = request.payload.city
  experiment.country     = request.payload.country
  experiment.idCreator   = request.payload.idCreator
  experiment.arduino     = request.payload.arduino
  experiment.image       = request.payload.image
  experiment.url         = request.payload.url
  experiment.days        = request.payload.days
  experiment.schedule    = request.payload.schedule
  experiment.duration    = request.payload.duration
  experiment.enabled     = request.payload.enabled
  experiment.description = request.payload.description

  experiment.save((error, experiment) => {
    if (!error) {
      reply({ message: 'EXPERIMENTO CREADO CORRECTAMENTE' })
    } else {
      console.log(error)
      reply(Boom.forbidden(error))
    }
  })
}