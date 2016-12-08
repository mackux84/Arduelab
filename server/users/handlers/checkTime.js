'use strict'

const Boom   = require('boom')
const Jwt    = require('jsonwebtoken')
const Moment = require('moment')
const key    = require('../../config/auth').key

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
      reply(Boom.forbidden('Invalid workbench token'))
      return
    }
    var diff = Moment().diff(Moment(decoded.iat * 1000))
    if (diff > key.tokenExpiry || diff < 0) {
      reply(Boom.forbidden('Token not active yet'))
      return
    } else {
      reply(parseInt(parseInt(key.tokenExpiry)-diff))
      return
    }
  })
}