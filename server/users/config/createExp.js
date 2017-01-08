'use strict'

const Joi = require('joi')
const errors = require('../../config/errors')
const updateUserSchema = require('../schemas/updateUser')

module.exports = {
  payload: {
    output: 'data',
    parse: true,
    allow: 'application/json'
    // maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
    // uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
  },
  auth: {
    // Add authentication to this route
    strategy: 'jwt',
    scope: ['Admin']
  },
  validate: {
    headers: updateUserSchema.headerSchema,
    payload: Joi.object({
      name: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(3).max(30).required().description('Experiment Name').example('Arduino Car'),
      university: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(3).max(30).required().description('Experiment University').example('Yale University'),
      url: Joi.string().min(3).max(30).required().description('The Experiment Url').example('http://google.com'),
      schedule: Joi.array().items(Joi.number()).required().description('The experiment Allowed initial Hours').example('[8,9,10,11,14,15,16,17,18]'),
      duration: Joi.array().items(Joi.number().multiple(30)).required().description('The experiment Allowed durations in Minutes (must be multiples of 30)').example('[30,60,90,120]'),
      enabled: Joi.boolean().required().description('Wheter the Experiment is enabled to registration').example(true)
    })
  },
  description: 'Create Experiment',
  notes: 'Create Experiment',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '201': {
          'description': 'Experiment created',
          'schema': Joi.object({
            message: Joi.string().required().description('Experiment created').default('Experiment created'),
          }).label('Reserved')
        },
        '400': errors.e400,
        '403': errors.e403,
        '500': errors.e500
      },
      payloadType: 'json',
      security: [{ 'jwt': [] }]
    }
  }
}