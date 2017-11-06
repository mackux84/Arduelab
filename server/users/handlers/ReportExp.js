'use strict'

const Boom   = require('boom')
const Common = require('../util/common')
const Jwt = require('jsonwebtoken')
const Moment = require('moment')
const key = require('../../config/auth').key
const decyptToken = require('../util/userFunctions').decyptToken

module.exports = function (request, reply) {
  let privateKey = require('../../config/auth').key.privateKey
  Jwt.verify(request.auth.token, privateKey, function (error, decoded) {
    if (error) {
      if (error.name === 'TokenExpiredError') {
        reply(Boom.forbidden('Token expired'))
        return
      }
    }
    if (decoded === undefined) {
      reply(Boom.forbidden('Invalid token'))
      return
    }
    if (decoded.type != 'user') {
      reply(Boom.forbidden('Invalid token'))
      return
    }
    var diff = Moment().diff(Moment(decoded.iat * 1000))
    if (diff > key.tokenExpiry || diff < 0) {
      reply(Boom.forbidden('Token not active yet'))
      return
    }
    decoded = decyptToken(decoded)


    ///////////////////////////////////////////////////////
    let report = {
      username       : request.payload.username,
      identification : request.payload.identification,
      email          : request.payload.email,
      report         : request.payload.report
    }
    exec('echo "USUARIO QUE REPORTA: '+report.username+'/r/nCORREO DEL USUARIO: '+report.email+'/r/nRAZONES: '+report.report+'" | mail -s "IDENTIFICACION DEL EXPERIMENTO: '+report.identification+'" arduinserver@gmail.com')
    reply("Gracias por su reporte!")
  })
}