'use strict'

const Boom        = require('boom')
const Experiment  = require('../models/Experiment')
const Jwt         = require('jsonwebtoken')
const decyptToken = require('../util/userFunctions').decyptToken
const Moment      = require('moment')
const key         = require('../../config/auth').key

module.exports = function (request, reply) {
  let privateKey = require('../../config/auth').key.privateKey
  Jwt.verify(request.auth.token, privateKey, function (error, decoded) {
    if (error) {
      if (error.name === 'TokenExpiredError') {
        reply(Boom.forbidden('TOKEN DE INGRESO EXPIRADO'))
        return
      }
    }
    if (decoded === undefined) {
      reply(Boom.forbidden('TOKEN INVALIDO'))
      return
    }
    if (decoded.type != 'user') {
      reply(Boom.forbidden('NO ES UN TOKEN DE USUARIO'))
      return
    }
    decoded = decyptToken(decoded)
    var diff = Moment().diff(Moment(decoded.iat * 1000))
    if (diff < 0) {
      reply(Boom.forbidden('ESTE TOKEN AUN NO SE ENCUENTRA DISPONIBLE'))
      return
    }
    if (diff > key.tokenExpiry) {
      reply(Boom.forbidden('TOKEN EXPIRO'))
      return
    }
    const id = request.params.id
    if (decoded.scope === 'Admin') {

      Experiment
        .findOneAndUpdate({ _id: id }, request.payload, (error, experiment) => {
          if (error) {
            reply(Boom.badRequest(error))
            return
          }
          if (!experiment) {
            reply(Boom.notFound('Experiment id=(' + request.params.id + ') not found!'))
            return
          }
          if ( request.payload.adminEnabled && !experiment.adminEnabled){
            var exec = require('child_process').exec
            exec('echo "EXPERIMENTO APROBADO, EL EXPERIMENTO ' + 
            experiment.name + ' HA SIDO APROBADO \n\n\n" | mail -s "EXPERIMENTO APROBADO " '+experiment.docCreator)          
          }

          reply({ message: 'Experiment updated!' })
        })
    } else {
      Experiment
        .findOne({ _id: id })
        // Deselect fields
        .select()
        .exec((error, experiment) => {
          if (error) {
            reply(Boom.badRequest(error))
            return
          }
          if (!experiment) {
            reply(Boom.notFound('Experiment id=(' + request.params.id + ') not found!'))
            return
          }
          if (!experiment.adminEnabled) {
            reply(Boom.forbidden('EXPERIMENTO DESHABILITADO POR ADMINISTRADOR'))
            return
          }
          const id = request.params.id
          Experiment
            .findOneAndUpdate({ _id: id }, request.payload, (error, experiment) => {
              if (error) {
                reply(Boom.badRequest(error))
                return
              }
              if (!experiment) {
                reply(Boom.notFound('Experiment id=(' + request.params.id + ') not found!'))
                return
              }
              reply({ message: 'Experiment updated!' })
            })
        })
    }
  })
}