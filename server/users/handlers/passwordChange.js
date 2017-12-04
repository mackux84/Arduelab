'use strict'

const Boom = require('boom')
const Common = require('../util/common')
const User = require('../models/User')
const decyptToken = require('../util/userFunctions').decyptToken
const Jwt = require('jsonwebtoken')

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
    if (request.payload.new_password !== request.payload.new_password_check) {
      reply(Boom.badRequest('NO SE PUDO VERIFICAR EL PASSWORD'))
      return
    }
    decoded = decyptToken(decoded)
    const id = decoded.id


    User
      .findOne({ _id: id }, (error, user) => {
        if (error) {
          reply(Boom.badRequest(error))
          return
        }
        if (!user) {
          reply(Boom.notFound('User id=(' + id + ') not found!'))
          return
        }
        var newEnc = Common.encrypt(request.payload.new_password)
        if (user.password === newEnc) {
          reply(Boom.badRequest('EL NUEVO Y LA ANTIGUA CONTRASEÑA SON LAS MISMAS'))
          return
        }
        var oldEnc = Common.encrypt(request.payload.old_password)
        if (user.password !== oldEnc) {
          reply(Boom.badRequest('PASWORD ANTIGO NO CONCUERDA'))
          return
        }
        user.password = newEnc
        user.save((error, user) => {
          if (!error) {
            reply({ message: 'CONTRASEÑA CAMBIADA' })
            return
          } else {
            if (11000 === error.code || 11001 === error.code) {
              reply(Boom.forbidden('POR FAVOR INGRESE UNA NUEVA DIRECCION DE CORREO'))
            } else {
              console.log(error)
              reply(Boom.forbidden(error)) // HTTP 403 //why?
            }
          }
        })
      })
  })
}