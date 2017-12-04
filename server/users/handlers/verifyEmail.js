'use strict'

const Boom        = require('boom')
const User        = require('../models/User')
const Jwt         = require('jsonwebtoken')
const decyptToken = require('../util/userFunctions').decyptToken
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
      reply(Boom.forbidden('LINK DE VERIFICACION INVALIDO'))
      return
    }
    decoded = decyptToken(decoded)
    if (decoded.scope != 'User') {
      reply(Boom.forbidden('LINK DE VERIFICACION INVALIDO'))
      return
    }
    var diff = Moment().diff(Moment(decoded.iat * 1000))
    if (diff < 0) {
      reply(Boom.forbidden('RESERVA AUN NO SE ENCUENTRA ACTIVA, INTENTA NUEVAMENTE MAS TARDE'))
      return
    }
    if (diff > key.tokenExpiry) {
      reply(Boom.forbidden('TOKEN EXPIRO'))
      return
    } 
    User.findOne({
      email: decoded.email,
      _id: decoded.id
    }, function (error, user) {
      if (error) {
        console.error(error)
        reply(Boom.badImplementation(error))
        return
      }
      if (user === null) {
        reply(Boom.forbidden('LINK DE VERIFICACION INVALIDA'))
        return
      }
      if (user.isVerified === true) {
        reply(Boom.forbidden('LA CUENTA YA SE ENCUENTRA VERIFICADA'))
        return
      }
      user.isVerified = true
      user.save(function (error) {
        if (error) {
          console.error(error)
          reply(Boom.badImplementation(error))
          return
        }
        if (request.headers.accept) {
          if (request.headers.accept.indexOf('application/json') === -1) {
            reply.redirect('/')
            return
          }
        }
        reply({message: 'CUENTA VERIFICADA SATISFACTORIAMENTE'})
        return
      })
    })
  })
}