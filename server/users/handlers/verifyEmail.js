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
        reply(Boom.forbidden('Token expired'))
        return
      }
    }
    if (decoded === undefined) {
      reply(Boom.forbidden('invalid verification link'))
      return
    }
    decoded = decyptToken(decoded)
    if (decoded.scope != 'User') {
      reply(Boom.forbidden('invalid verification link'))
      return
    }
    var diff = Moment().diff(Moment(decoded.iat * 1000))
    if (diff < 0) {
      reply(Boom.forbidden('Token not active yet'))
      return
    }
    if (diff > key.tokenExpiry) {
      reply(Boom.forbidden('Token expired'))
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
        reply(Boom.forbidden('invalid verification link'))
        return
      }
      if (user.isVerified === true) {
        reply(Boom.forbidden('account is already verified'))
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
            reply.view('login.html')
            return
          }
        }
        reply({message: 'account sucessfully verified'})
        return
      })
    })
  })
}