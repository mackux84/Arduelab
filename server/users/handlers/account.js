'use strict'

const Boom        = require('boom')
const User        = require('../models/User')
const Jwt         = require('jsonwebtoken')
const decyptToken = require('../util/userFunctions').decyptToken
const Moment      = require('moment')
const key         = require('../../config/auth').key

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
      reply(Boom.forbidden('Invalid user token'))
      return
    }
    if (decoded.type != 'user') {
      reply(Boom.forbidden('Not a user token'))
      return
    }
    decoded = decyptToken(decoded)
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
        reply(Boom.forbidden('User not valid'))
        return
      }
      if (user.isVerified === true) {
        if (user.scope ==='Admin') {
          reply.view('admin.html')
          return
        }
        reply.view('account.html')
        return
      }
    })
  })
}