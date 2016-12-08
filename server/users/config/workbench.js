'use strict'

const Joi    = require('joi')
const errors = require('../../config/errors')

module.exports = {
  auth: false,
  validate: {
    params: Joi.object({ token: Joi.string().required().description('JWT').default('hbGciOiJIUzI1NiIsInR5cCI6kpVCJ9eyJoYXNoIjoiNGI4OZiZDZlMzM5YTcyMJOWIxZjhjMzM0ODIxNzI1OGZOD1N2FmN2Y3MzQxMzgzYjEyMzYzNNjZjNDBlNDNmZmQ2YmY4NTZhZjY2OTBjMmU1MWI1N2YyIiwiaWF0IjocyNTk2NTE3LCJleHAOjE0NzI2MDxMTd9HL7yOlzW4KJz5qMhMs9lKAlOyavRXdlk6uXQ')}).label('JWT')
  },
  description: 'Workbench',
  notes: 'Workbench active with JWT',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Workbench enabled for this user',
          'schema': Joi.object({
            message: Joi.string().required().description('message').default('Workbench enabled for this user')
          }).label('Workbench enabled for this user')
        },
        '400': errors.e400,
        '403': errors.e403,
        '500': errors.e500
      },
    // payloadType: 'json',
    // security: [{ 'jwt': [] }]
    }
  }
}