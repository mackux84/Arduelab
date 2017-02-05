'use strict'

const Boom   = require('boom')
const User   = require('../models/User')
const Common = require('../util/common')

module.exports = function (request, reply) {
  User.findOne({
    email: request.payload.email ,
  }, function (error, user) {
    if (!error) {
      if (user === null) {
        reply(Boom.forbidden('CORREO INVALIDO'))
        return
      }
      Common.sentMailForgotPassword(user, (error) => {
        if (error) {
          reply(Boom.serverUnavailable('POR FAVOR INTENTE MAS TARDE'))
          return
        }
        reply({message: 'LA CONTRASEÑA FUE ENVIADA AL CORREO ELECTRONICO ENVIADO'})
      })
    }else {
      console.error(error)
      reply(Boom.badImplementation(error))
    }
  })
}