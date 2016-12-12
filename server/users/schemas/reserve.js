'use strict'

const Joi = require('joi')

const createUserSchema = Joi.object({
  dia:  Joi.number().integer().positive().greater(0).min(1).less(32).max(31).required().description('Reserved Day').example('14'),
  mes:  Joi.number().integer().positive().greater(0).min(1).less(13).max(12).required().description('Reserved Month').example('10'),
  anio: Joi.number().integer().positive().greater(2015).min(2016).less(2019).max(2018).required().description('Reserved Year').example('2016'),
  hora: Joi.number().integer().positive().min(0).less(24).max(23).required().description('Reserved Hour').example('13'),
  experimento: Joi.string().required().description('Experiment id').example('235325425513125312353463')
}).label('Reserve Time Schema')

module.exports = createUserSchema
