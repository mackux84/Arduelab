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
        reply(Boom.forbidden('TOKEN EXPIRO'))
        return
      }
    }
    if (decoded === undefined) {
      reply(Boom.forbidden('TOKEN INVALIDO'))
      return
    }
    if (decoded.type != 'user') {
      reply(Boom.forbidden('TOKEN INVALIDO'))
      return
    }
    var diff = Moment().diff(Moment(decoded.iat * 1000))
    if (diff > key.tokenExpiry || diff < 0) {
      reply(Boom.forbidden('RESERVA AUN NO SE ENCUENTRA ACTIVA, INTENTE NUEVAMENTE MAS TARDE'))
      return
    }
    //If header (user) token is valid, create reservation token and add it to reservation DB
    decoded = decyptToken(decoded)
    var datetest = new Date(request.payload.start)
    var today = new Date()
    today.setTime( today.getTime() - today.getTimezoneOffset()*60*1000 )
    if (datetest < today) {
      reply(Boom.badRequest('NO SE PUEDE CREAR UNA RESERVA EN EL PASADO'))
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
              var datetest2 = new Date(element.initialDate)
              //var today = new Date()
              datetest2.setTime( datetest2.getTime() + element.duration*60*1000 )
              if (datetest2 < today) {
                //reserva expiro
                element.enabled = false
                element.save()
                canReserve=true
              } else {
                canReserve = false
              }
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
                reply(Boom.notFound('NO SE HAN CONTRADO EXPERIMENTOS CON ESA IDENTIFICACION'))
                return
              }
              if (experiment.enabled) {
                if (experiment.days.indexOf(datetest.getUTCDay()) != -1) {
                  if ((experiment.schedule[0] <= tokenData.hora) && (experiment.schedule[3] >= tokenData.hora)) {
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
                      reserve.expName = experiment.name
                      reserve.url= experiment.url
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
                            reply(Boom.badRequest('ESE TIEMPO YA SE ENCUENTRA RESERVADO'))
                          } else {
                            // console.log(error)
                            reply(Boom.badRequest(error))
                          }
                        }
                      })
                    } else {
                      reply(Boom.badRequest('TIEMPO SOLICITADO NO PERMITIDO'))
                    }
                  } else {
                    reply(Boom.badRequest('TIEMPO INICIAL SOLICITADO NO PERMITIDO'))
                  }
                } else {
                  reply(Boom.badRequest('RDIA SOLICITADO NO PERMITIDIO'))
                }
              } else {
                reply(Boom.badRequest('EXPERIMENTO REQUERIDO NO SE ENCUENTRA HABILITADO'))
              }
            })
        } else {
          reply(Boom.badRequest('YA CUENTAS CON UNA RESERVA ACTIVA PARA ESTE EXPERIMENTO'))
        }
      })




  })

}