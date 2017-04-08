'use strict'

const Boom    = require('boom')
const Creator = require('../models/Creator')

module.exports = function (request, reply) {
  let creator            = new Creator()
  creator.identification = request.payload.identification
  creator.name           = request.payload.name
  creator.email          = request.payload.email
  creator.telephone      = request.payload.telephone
  creator.celphone       = request.payload.celphone

  creator.save((error, creator) => {
    if (!error) {
      reply({ message: 'CREADOR CREADO CORRECTAMENTE' }) 
    }else {
      if (11000 === error.code || 11001 === error.code) {
        reply(Boom.forbidden('POR FAVOR INGRESE OTRa IDENTIFICACION, ESTA YA SE ENCUENTRA EN USO'))
      } else {
        console.log(error)
        reply(Boom.forbidden(error)) // HTTP 403 //why?
      }
    }
  })
  // })
}