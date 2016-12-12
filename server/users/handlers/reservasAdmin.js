'use strict'

const Boom = require('boom')
const Reserve = require('../models/Reserve')
const Jwt = require('jsonwebtoken')
const decyptToken = require('../util/userFunctions').decyptToken

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
    decoded = decyptToken(decoded)
    var array = request.payload.array
    if (array.length > 0) {
      var str = new Array()
      for (var index = 0; index < array.length; index++) {
        str[index] = { email: array[index] }
      }
      Reserve
        .find().or(str)
        // Deselect fields
        .select(' -__v -updated_At -scope')
        .exec((error, reserve) => {
          if (error) {
            reply(Boom.badRequest(error))
            return
          }
          if (!reserve.length) {
            reply(Boom.notFound('No reserves found!'))
            return
          }
          reply(reserve)
          return
        })
    } else {
      reply(Boom.badRequest('Must select atleast one student'))
      return
    }
  })
}