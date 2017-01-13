'use strict'

const Joi              = require('joi')
const updateUserSchema = require('../schemas/updateUser')
const errors           = require('../../config/errors')

module.exports = {
  payload: {
    output: 'data',
    parse: true,
    allow: 'application/json'
  // maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
  // uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
  },
  validate: {
    params: updateUserSchema.paramsSchema,
    headers: updateUserSchema.headerSchema,
    payload: Joi.object({
      name: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(3).max(30).description('Experiment Name').example('Arduino Car'),
      university: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(3).max(30).description('Experiment University').example('Yale University'),
      url: Joi.string().min(3).max(30).description('The Experiment Url').example('http://google.com'),
      days: Joi.array().items(Joi.number().min(0).max(6)).description('The experiment Allowed Days in UTC format, Sunday is 0, Monday is 1, and so on.').example('[1,2,3,4]'),
      schedule: Joi.array().length(2).items(Joi.number().min(0).max(23)).required().description('The experiment active hours (initial,, final)').example('[8,18]'),
      duration: Joi.array().items(Joi.number().multiple(30)).description('The experiment Allowed durations in Minutes (must be multiples of 30)').example('[30,60,90,120]'),
      enabled: Joi.boolean().description('Wheter the Experiment is enabled to registration').example(true),
      description: Joi.string().description('Experiment Description').example('Program an RGB LED with Arduino!!')
    })
  },
  auth: {
    strategy: 'jwt',
    scope: 'Admin'
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