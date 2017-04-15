'use strict'

const Boom = require('boom')
const Experiment = require('../models/Experiment')
var fs = require('fs')

module.exports = function (request, reply) {
  let experiment         = new Experiment()
  experiment.name        = request.payload.name
  experiment.university  = request.payload.university
  experiment.city        = request.payload.city
  experiment.country     = request.payload.country
  experiment.idCreator   = request.payload.idCreator
  experiment.docCreator  = request.payload.docCreator
  experiment.arduino     = request.payload.arduino
  experiment.image       = request.payload.image
  experiment.url         = request.payload.url
  experiment.days        = request.payload.days
  experiment.schedule    = request.payload.schedule
  experiment.duration    = request.payload.duration
  experiment.enabled     = request.payload.enabled
  experiment.description = request.payload.description
  experiment.pdf         = request.payload.pdffile

  experiment.save((error, experiment) => {
    if (!error) {
      reply({ message: 'EXPERIMENTO CREADO CORRECTAMENTE' })
      var path1 = __dirname + '/../../../uploads/' + experiment.pdf
      var path2 = __dirname + '/../../../uploads/' + experiment._id
      fs.rename(path1, path2, function (err) {
        if (err) {
          console.log(err)
        } else {
          console.log('Renamed '+ path1 + ' to '+ path2)
        }

      })

    } else {
      console.log(error)
      reply(Boom.forbidden(error))
    }
  })
}