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
        reply(Boom.forbidden('TOKEN EXPIRO'))
        return
      }
    }
    if (decoded === undefined) {
      reply(Boom.forbidden('TOKEN INVALIDO'))
      return
    }
    if (decoded.type != 'user') {
      reply(Boom.forbidden('TOKEN INVALIDO'))
      return
    }
    var diff = Moment().diff(Moment(decoded.iat * 1000))
    if (diff > key.tokenExpiry || diff < 0) {
      reply(Boom.forbidden('RESERVA AUN NO ESTA ACTIVA, INTENTE NUEVAMENTE MAS TARDE'))
      return
    }
    decoded = decyptToken(decoded)


    ///////////////////////////////////////////////////////
    let report = {
      username       : request.payload.username,
      userID         : request.payload.userID,
      expID          : request.payload.expID,
      email          : request.payload.email,
      report         : request.payload.report
    }
    var exec = require('child_process').exec
    exec('echo "USUARIO QUE REPORTA: ' + report.username + '\nCORREO DEL USUARIO: ' + report.email + '\nRAZONES: ' + report.report + '" | mail -s "IDENTIFICACION DEL EXPERIMENTO: ' + report.expID+'" arduinserver@gmail.com')
    reply({ message: 'Reporte generado satisfactoriamente, muy pronto nos pondremos en contacto con usted' })
  })
}