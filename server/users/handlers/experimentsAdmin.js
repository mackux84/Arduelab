'use strict'

const Boom = require('boom')
const Experiment = require('../models/Experiment')
const Jwt = require('jsonwebtoken')
const Moment = require('moment')
const key = require('../../config/auth').key
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
      reply(Boom.forbidden('Not a user token'))
      return
    }
    
    decoded = decyptToken(decoded)

    var diff = Moment().diff(Moment(decoded.iat * 1000))
    if (diff > key.tokenExpiry || diff < 0) {
      reply(Boom.forbidden('Token not active yet'))
      return
    } else {

      if (decoded.scope === 'Admin') {
        Experiment
          .find()
          // Deselect the password and version fields
          .select('-updated_At -__v')
          .exec((error, experiments) => {
            if (error) {
              reply(Boom.badRequest(error))
              return
            }
            if (!experiments.length) {
              reply(Boom.notFound('No Experiments found!'))
              return
            }
            reply(experiments)
          })
      } else {
        Experiment
          .find({enabled:'true'})
          // Deselect the password and version fields
          .select('-updated_At -__v -created_At -url -enabled')
          .exec((error, experiments) => {
            if (error) {
              reply(Boom.badRequest(error))
              return
            }
            if (!experiments.length) {
              reply(Boom.notFound('No Experiments found!'))
              return
            }
            reply(experiments)
          })
      }
    }
  })
}