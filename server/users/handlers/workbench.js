'use strict'

const Boom = require('boom')
const Jwt = require('jsonwebtoken')
const Reserve = require('../models/Reserve')
//const decyptToken2 = require('../util/userFunctions').decyptToken2
const Moment = require('moment')
const key = require('../../config/auth').key

module.exports = function (request, reply) {
  let privateKey = require('../../config/auth').key.privateKey
  Jwt.verify(request.params.token, privateKey, function (error, decoded) {
    if (error) {
      if (error.name === 'TokenExpiredError') {
        reply(Boom.forbidden('TOKEN EXPIRO'))
        return
      }
    }
    if (decoded === undefined) {
      reply(Boom.forbidden('TOKEN INVALIDO DE EXPERIMENTO'))
      return
    }
    //decoded = decyptToken2(decoded)
    if (decoded.type != 'workbench') {
      reply(Boom.forbidden('NO ES UN TOKEN DE EXPERIMENTO'))
      return
    }
    var diff = Moment().diff(Moment(decoded.iat * 1000))
    if (diff < 0) {
      reply(Boom.forbidden('RESERVA NO ACTIVA AUN, INTENTE NUEVAMENTE MAS TARDE'))
      return
    }
    if (diff > key.tokenExpiry) {
      reply(Boom.forbidden('TOKEN EXPIRO'))
      return
    }
    Reserve
      .findOne({ token: request.params.token }, (error, reserve) => {
        if (error) {
          console.error(error)
          reply(Boom.badImplementation(error))
          return
        }
        if (reserve== null) {
          reply(Boom.forbidden('TOKEN NO SE ENCUENTRA EN LA BASE DE DATOS'))
          return
        }
        if (reserve.enabled === true) {
          reply(Boom.forbidden('RESERVA DESHABILITADA POR EL ADMINISTRADOR'))
          return
        }
        //reply.view('workbench.html')
        reply.redirect('181.131.75.129:8081/workspace.html')
        return
      })

  })
}
