'use strict'

const Boom = require('boom')
const createToken2 = require('../util/userFunctions').createToken2
const Reserve = require('../models/Reserve')
const Jwt = require('jsonwebtoken')
const Moment = require('moment')
const key = require('../../config/auth').key
const decyptToken = require('../util/userFunctions').decyptToken

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
    } else {
      //If header (user) token is valid, create reservation token and add it to reservation DB
      decoded = decyptToken(decoded)
      var datetest= new Date(request.payload.start)
      var today = new Date()
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


      //TODO: check experiment avaliable and allowed time


      
      var token = createToken2(tokenData)

      let reserve = new Reserve()
      reserve.email = decoded.email
      reserve.initialDate = new Date(tokenData.anio + '-' + tokenData.mes + '-' + tokenData.dia + 'T' + tokenData.hora + ':00:00')
      reserve.duration = key.tokenExpiry
      reserve.token = token
      reserve.used = false
      reserve.enabled = true
      reserve.scope = decoded.scope
      reserve.idExp= request.payload.experimento
      reserve.save((error, reserve) => {
        if (!error) {
          var res = {
            date: reserve.initialDate,
            duration: reserve.duration
          }
          reply(res).code(201)
        } else {
          if (11000 === error.code || 11001 === error.code) {
            console.log(error)
            reply(Boom.forbidden('Time already reserved'))
          } else {
            console.log(error)
            reply(Boom.forbidden(error))
          }
        }
      })
    }
  })

}