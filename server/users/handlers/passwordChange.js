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
    if (request.payload.new_password !== request.payload.new_password_check) {
      reply(Boom.badRequest('Password check failed'))
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
          reply(Boom.badRequest('new and old passwords are the same'))
          return
        }
        var oldEnc = Common.encrypt(request.payload.old_password)
        if (user.password !== oldEnc) {
          reply(Boom.badRequest('old password mismatch'))
          return
        }
        user.password = newEnc
        user.save((error, user) => {
          if (!error) {
            reply({ message: 'Password Changed' })
            return
          } else {
            if (11000 === error.code || 11001 === error.code) {
              reply(Boom.forbidden('please provide another user email'))
            } else {
              console.log(error)
              reply(Boom.forbidden(error)) // HTTP 403 //why?
            }
          }
        })
      })
  })
}