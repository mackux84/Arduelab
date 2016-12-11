'use strict'

const Joi = require('joi')
const updateUserSchema = require('../schemas/updateUser')
const errors = require('../../config/errors')

module.exports = {
  payload: {
    output: 'data',
    parse: true,
    allow: 'application/json'
    // maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
    // uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
  },
  validate: {
    payload: Joi.object({
      token: Joi.string().required().description('Token'),
      expID: Joi.objectId().required().description('Must match a 24 chars objectid')
    }),
    params: Joi.object({
      id: Joi.string().required().description('Token')
    }),
    headers: updateUserSchema.headerSchema
    
  },
  auth: {
    strategy: 'jwt',
  },
  description: 'Check workbench auth info',
  notes: 'Check workbench auth info',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'User correct',
          'schema': Joi.object({
            message: Joi.string().required().description('message').default('User correct!')
          }).label('User correct')
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