'use strict'

const Boom        = require('boom')
const Reserve     = require('../models/Reserve')
const Jwt         = require('jsonwebtoken')
const decyptToken2 = require('../util/userFunctions').decyptToken2
const Moment      = require('moment')
// const key         = require('../../config/auth').key

module.exports = function (request, reply) {
  var token1 = request.params.id
  //var token2 = request.auth.token
  var token3 = request.payload.token

  // if ((token1 === token2) && (token2 === token3)) {
  if(token1===token3){
    let privateKey = require('../../config/auth').key.privateKey
    Jwt.verify(request.params.id, privateKey, function (error, decoded) {
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
      if (decoded.type != 'workbench') {
        reply(Boom.forbidden('ESTE NO ES UN TOKEN DE LABORATORIO VALIDO'))
        return
      }
      decoded = decyptToken2(decoded)
      if (decoded.experimento !== request.payload.expID) {
        reply(Boom.forbidden('ESTE TOKEN NO ES VALIDO PARA ESTE EXPERIMENTO')) 
        return
      }
      //var today = new Date()
      //today.setTime(today.getTime() - today.getTimezoneOffset() * 60 * 1000)
      //var tp = Moment(decoded.iat *1000)
      //tp.add(today.getTimezoneOffset()*60*1000)
      //var diff = Moment().diff(Moment(decoded.iat * 1000 + today.getTimezoneOffset()*60*1000))
      var diff = Moment().diff(Moment(decoded.iat * 1000))
     // var diff2 = Moment().diff(tp)
      if (diff < 0) {
        reply(Boom.forbidden('RESERVA AUN NO SE ENCUENTRA ACTIVA, INTENTE NUEVAMENTE MAS TARDE'))
        return
      }
      if (diff > decoded.duracion*60*1000) {
        reply(Boom.forbidden('TOKEN EXPIRO'))
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
            reply(Boom.forbidden('TOKEN NO SE ENCUENTRA EN LA BASE DE DATOS'))
            return
          }
          if (reserve.enabled === false) {
            reply(Boom.forbidden('RESERVA DESHABILITADO POR EL ADMINISTRADOR'))
            return
          }
          //reply.view('workbench.html')
          var replyjson = {
            statusCode: 202,
            message: 'ok'
          }
          reserve.used = true
          reserve.save()
          reply(replyjson)
          return
        })
    })
  }
}