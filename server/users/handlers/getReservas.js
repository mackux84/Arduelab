'use strict'

const Boom = require('boom')
const Reserve = require('../models/Reserve')
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
      reply(Boom.forbidden('Invalid token'))
      return
    }
    var diff = Moment().diff(Moment(decoded.iat * 1000))
    if (diff > key.tokenExpiry || diff < 0) {
      reply(Boom.forbidden('Token not active yet'))
      return
    }
    decoded = decyptToken(decoded)
    Reserve
      .find().and([{ email: decoded.email }, { enabled: true }])
      // Deselect fields
      .select('-_id -__v -updated_At -scope -email')
      .exec((error, reserve) => {
        if (error) {
          reply(Boom.badRequest(error))
          return
        }
        if (!reserve.length) {
          reply(Boom.notFound('No reserves found!'))
          return
        }
        ////////////////////////////////////  reply(reserve)

        var expIds = []
        for (var index = 0; index < reserve.length; index++) {
          var element = reserve[index]
          expIds.push(element.idExp)
        }
        Experiment
          .find({
            '_id': { $in: expIds }
          })
          // Deselect the password and version fields
          .select('-updated_At -__v -created_At -enabled')
          .exec((error, experiments) => {
            if (error) {
              reply(Boom.badRequest(error))
              return
            }
            if (!experiments.length) {
              reply(Boom.notFound('No Experiments found!'))
              return
            }
            var reservesA = []
            for (var index = 0; index < experiments.length; index++) {
              var element = experiments[index]
              var json = {
                created_At: reserve[index].created_At,
                initialDate: reserve[index].initialDate,
                duration: reserve[index].duration,
                used: reserve[index].used,
                token: reserve[index].token,
                url: element.url
              }
              reservesA.push(json)
            }
            reply(reservesA)
          })
      })
  })
}