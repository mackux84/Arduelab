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
    scope: ['User','Admin']
  },
  validate: {
    headers: updateUserSchema.headerSchema,
    payload: Joi.object({
      old_password: Joi.string().required().description('old Password').example('password123'),
      new_password: Joi.string().required().description('New Password').example('ANewSecurePassword5286'),
      new_password_check: Joi.string().required().description('New Password Check').example('ANewSecurePassword5286')
    })
  },
  description: 'Change User Password',
  notes: 'Change User Password',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '201': {
          'description': 'Password Changed',
          'schema': Joi.object({
            message: Joi.string().required().description('Password Changed').default('Password Changed'),
          }).label('Password Changed')
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