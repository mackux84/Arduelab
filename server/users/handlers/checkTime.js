'use strict'

const Boom   = require('boom')
const Jwt    = require('jsonwebtoken')
const Moment = require('moment')
// const decyptToken = require('../util/userFunctions').decyptToken
const decyptToken2 = require('../util/userFunctions').decyptToken2
const key    = require('../../config/auth').key

module.exports = function (request, reply) {
  let privateKey = require('../../config/auth').key.privateKey
  Jwt.verify(request.auth.token, privateKey, function (error, decoded) {
    if (error) {
      if (error.name === 'TokenExpiredError') {
        reply(Boom.forbidden('TOKEN EXPIRO'))
        return
      }
    }
    if (decoded === undefined) {
      reply(Boom.forbidden('TOKEN INVALIDO'))
      return
    }
    if (decoded.type != 'user') {
      //workbench token
      decoded = decyptToken2(decoded)
      var diff = Moment().diff(Moment(decoded.iat * 1000))
      if (diff < 0) {
        reply(Boom.forbidden('RESERVA AUN NO ACTIVA, INTENTE NUEVAMENTE MAS TARDE'))
        return
      }
      if (diff > decoded.duracion*60*1000) {
        reply(Boom.forbidden('TOKEN EXPIRO'))
        return
      }
      reply((decoded.duracion * 60 * 1000) - diff)
      return
    } else {
      // decoded = decyptToken(decoded)
      var diff2 = Moment().diff(Moment(decoded.iat * 1000))
      if (diff < 0) {
        reply(Boom.forbidden('RESERVA AUN NO ACTIVA, INTENTE NUEVAMENTE MAS TARDE'))
        return
      }
      if (diff > key.tokenExpiry) {
        reply(Boom.forbidden('TOKEN EXPIRO'))
        return
      }
      reply(parseInt(parseInt(key.tokenExpiry) - diff2))
      return
    }  
  })
}