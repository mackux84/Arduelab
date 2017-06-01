'use strict'

const Joi              = require('joi')
const updateUserSchema = require('../schemas/updateUser')
const verifyCreatorExists = require('../util/userFunctions').verifyCreatorExists
const errors           = require('../../config/errors')
Joi.objectId = require('joi-objectid')(Joi)

module.exports = {
  payload: {
    output: 'data',
    parse: true,
    allow: 'application/json'
  // maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
  // uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
  },
  pre: [
    // Before the route handler runs, verify that the user is unique
    { method: verifyCreatorExists }
  ],
  validate: {
    params: updateUserSchema.paramsSchema,
    headers: updateUserSchema.headerSchema,
    payload: Joi.object({
      name: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(3).max(30).description('Experiment Name').example('Arduino Car'),
      university: Joi.string().regex(/^[a-zA-Z0-9 ]{3,60}$/).min(3).max(60).description('Experiment University').example('Yale University'),
      city: Joi.string().regex(/^[a-zA-Z0-9 ]{3,60}$/).min(3).max(60).description('Ciudad del experimento').example('Barranquilla'),
      country: Joi.string().regex(/^[a-zA-Z0-9 ]{3,60}$/).min(3).max(60).description('País del experimento').example('Colombia'),
      idCreator: Joi.objectId().description('Identificador de creador').example('235325425513125312353463'),
      docCreator: Joi.string().required().description('Documento de identidad del creador').example('8859236584'),
      arduino: Joi.string().description('Arduino usado en el experimento').example('Arduino Mega 2560'),
      url: Joi.string().min(3).description('The Experiment Url').example('http://google.com'),
      days: Joi.array().items(Joi.number().min(0).max(6)).description('The experiment Allowed Days in UTC format, Sunday is 0, Monday is 1, and so on.').example('[1,2,3,4]'),
      schedule: Joi.array().length(4).items(Joi.number().min(0).max(24)).description('Las horas activas del experimento (inicio,fin-inicio,fin) formato 24h').example('[8,12,14,18]'),
      duration: Joi.array().items(Joi.number().multiple(30)).description('The experiment Allowed durations in Minutes (must be multiples of 30)').example('[30,60,90,120]'),
      enabled: Joi.boolean().description('Wheter the Experiment is enabled to registration').example(true),
      adminEnabled: Joi.boolean().description('Wheter the Experiment is enabled to registration').example(true),
      description: Joi.string().description('Experiment Description').example('Program an RGB LED with Arduino!!')
    })
  },
  auth: {
    strategy: 'jwt',
    scope: ['Creator','Admin']
  },
  description: 'Patch experiment',
  notes: 'Edit experiment, Require \'Admin\' scope',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Experiment updated',
          'schema': Joi.object({
            message: Joi.string().required().description('message').default('Experiment updated!')
          }).label('Experiment updated')
        },
        '400': errors.e400,
        '401': errors.e401,
        '404': errors.e404,
        '500': errors.e500
      },
      payloadType: 'json',
      security: [{ 'jwt': [] }]
    }
  }
}