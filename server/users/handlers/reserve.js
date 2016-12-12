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
      var diatemp = request.payload.dia
      if (diatemp<10) {
        diatemp = '0'+diatemp //JS ISO format days must be 2 digits (leading zero)
      }
      var mestemp = parseInt(request.payload.mes) //JS month date starts at 0
      if (mestemp<10) {
        mestemp = '0'+mestemp //JS ISO format month must be 2 digits (leading zero)
      }
      var hourtemp = parseInt(request.payload.hora) //Time Zone, JS date os UTC
      if (hourtemp<10) {
        hourtemp = '0'+hourtemp //JS ISO format hour must be 2 digits (leading zero)
      }
      var tokenData = {
        dia: diatemp,
        mes: mestemp,
        anio: request.payload.anio,
        hora: hourtemp,
        experimento: request.payload.experimento
      }
      var datetest = new Date(Date.UTC(tokenData.anio, tokenData.mes-1, tokenData.dia, tokenData.hora+5, 0, 0))
      var today = new Date()
      if (datetest < today) {
        reply(Boom.badRequest('Invalid submited Date'))
        return
      }

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