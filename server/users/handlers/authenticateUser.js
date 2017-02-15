'use strict'

const Boom        = require('boom')
const createToken = require('../util/userFunctions').createToken

module.exports = function (request, reply) {
  // If the user's password is correct, we can issue a token.
  // If it was incorrect, the error will bubble up from the pre method
  // "Your email address is not verified. please verify your email address to proceed"
  if (request.pre.user === 'SU CUENTA DE CORREO AUN NO SE ENCUENTRA VERIFICADA, REVISE SU CORREO ELECTRONICO O CONTACTE AL ADMININSTRADOR') {
    reply(Boom.forbidden('TU DIRECCION DE CORREO ELECTRONICO AUN NO HA SIDO VALIDADA, CONTACTE AL ADMINISTRADOR')) // HTTP 403 
    return
  }
  var tokenData = {
    email: request.pre.user._doc.email,
    scope: request.pre.user._doc.scope,
    id: request.pre.user._doc._id
  }
  var res = {
    email: request.pre.user._doc.email,
    scope: request.pre.user._doc.scope,
    token: createToken(tokenData)
  }
  reply(res).code(201)
}