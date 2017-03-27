'use strict'

const Boom = require('boom')
const createToken2 = require('../util/userFunctions').createToken2
const Reserve = require('../models/Reserve')
const Experiment = require('../models/Experiment')
const Jwt = require('jsonwebtoken')
const Moment = require('moment')
const key = require('../../config/auth').key
const decyptToken = require('../util/userFunctions').decyptToken

Date.prototype.addHours = function(h) {    
  this.setTime(this.getTime() + (h*60*60*1000))
  return this
}

module.exports = function (request, reply) {
  let privateKey = key.privateKey
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
    //If header (user) token is valid, create reservation token and add it to reservation DB
    decoded = decyptToken(decoded)
    var datetest = new Date(request.payload.start)
    var today = new Date()
    today.setTime( today.getTime() - today.getTimezoneOffset()*60*1000 )
    if (datetest < today) {
      reply(Boom.badRequest('Invalid submited Date'))
      return
    }
    var tokenData = {
      minuto: datetest.getUTCMinutes(),
      hora: datetest.getUTCHours(),
      dia: datetest.getUTCDate(),
      mes: datetest.getUTCMonth(),
      anio: datetest.getUTCFullYear(),
      duracion: request.payload.duration,
      experimento: request.payload.experiment
    }
    var searchquery = {
      email: decoded.email,
      idExp: tokenData.experimento
    }
    Reserve
      .find(searchquery)
      // Deselect fields
      .select(' -__v -updated_At -scope')
      .exec((error, reserve) => {
        if (error) {
          reply(Boom.badRequest(error))
          return
        }
        var canReserve = false
        if (!reserve.length) {
          //no reserves found
          canReserve = true
        } else {
          for (var index = 0; index < reserve.length; index++) {
            var element = reserve[index]
            if (element.enabled) {
              //already reserved for this experiment
              canReserve = false
              break
            } else {
              canReserve = true
            }
          }
        }
        if (canReserve) {
          Experiment
            .findOne({ _id: tokenData.experimento })
            // Deselect fields
            //.select('-__v -updated_At')
            .exec((error, experiment) => {
              if (error) {
                reply(Boom.badRequest(error))
                return
              }
              if (experiment == null) {
                reply(Boom.notFound('No experiments with that ID found!'))
                return
              }
              if (experiment.enabled) {
                if (experiment.days.indexOf(datetest.getUTCDay()) != -1) {
                  if ((experiment.schedule[0] <= tokenData.hora) && (experiment.schedule[1] >= tokenData.hora)) {
                    if (experiment.duration.indexOf(tokenData.duracion) != -1) {
                      var token = createToken2(tokenData)
                      let reserve = new Reserve()
                      reserve.email = decoded.email
                      reserve.initialDate = datetest
                      reserve.duration = tokenData.duracion
                      reserve.token = token
                      reserve.used = false
                      reserve.enabled = true
                      reserve.scope = decoded.scope
                      reserve.idExp = request.payload.experiment
                      reserve.save((error, reserve) => {
                        if (!error) {
                          var res = {
                            date: reserve.initialDate,
                            duration: reserve.duration,
                            name: experiment.name,
                            university: experiment.university,
                            url: experiment.url
                          }
                          reply(res).code(201)
                        } else {
                          if (11000 === error.code || 11001 === error.code) {
                            // console.log(error)
                            reply(Boom.badRequest('Time already reserved'))
                          } else {
                            // console.log(error)
                            reply(Boom.badRequest(error))
                          }
                        }
                      })
                    } else {
                      reply(Boom.badRequest('Requested Duration not Allowed'))
                    }
                  } else {
                    reply(Boom.badRequest('Requested Initial Time not Allowed'))
                  }
                } else {
                  reply(Boom.badRequest('Requested Day not Allowed'))
                }
              } else {
                reply(Boom.badRequest('Requested Experiment not Enabled'))
              }
            })
        } else {
          reply(Boom.badRequest('You already have an active Reserve for this experiment'))
        }
      })




  })

}