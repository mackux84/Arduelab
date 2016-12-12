'use strict'

const Joi = require('joi')

const createUserSchema = Joi.object({
  start: Joi.date().iso().required().description('Fecha inicial en formato ISO').example('2014-09-08T08:02:17-05:00'),
  duration: Joi.number().positive().integer().required().description('Duracion de la reserva en minutos').example('120'),
  experiment: Joi.objectId().required().description('Identificador de experimento').example('235325425513125312353463')
}).label('Reserve Time Schema')

module.exports = createUserSchema