'use strict'

const Boom        = require('boom')
const Reserve     = require('../models/Reserve')
const Jwt         = require('jsonwebtoken')
const decyptToken2 = require('../util/userFunctions').decyptToken2
const Moment      = require('moment')
const key         = require('../../config/auth').key

module.exports = function (request, reply) {
  var token1 = request.params.id
  var token2 = request.auth.token
  var token3 = request.payload.token

  if ((token1 === token2) && (token2 === token3)) {
    let privateKey = require('../../config/auth').key.privateKey
    Jwt.verify(request.params.id, privateKey, function (error, decoded) {
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
      if (decoded.type != 'workbench') {
        reply(Boom.forbidden('Invalid token'))
        return
      }
      decoded = decyptToken2(decoded)
      if (decoded.idExp !== request.payload.expID) {
        reply(Boom.forbidden('Invalid token')) 
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
      Reserve
        .findOne({ token: request.params.id }, (error, reserve) => {
          if (error) {
            console.error(error)
            reply(Boom.badImplementation(error))
            return
          }
          if (reserve == null) {
            reply(Boom.forbidden('Token not in database'))
            return
          }
          if (reserve.enabled === false) {
            reply(Boom.forbidden('Token Disabled By an Administrator'))
            return
          }
          //reply.view('workbench.html')
          var replyjson = {
            statusCode: 202,
            message: 'ok'
          }
          reply(replyjson)
          return
        })
    })
  }
}