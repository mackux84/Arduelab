'use strict'

const Joi = require('joi')
const errors = require('../../config/errors')

module.exports = {
  auth: {
    // Add authentication to this route
    strategy: 'jwt',
    scope: ['User', 'Admin']
  },
  description: 'Check Time',
  notes: 'Check JWT Current Time Left',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Check JWT Current Time Left',
          'schema': Joi.object({
            message: Joi.string().required().description('message').default('Check JWT Current Time Left')
          }).label('Check JWT Current Time Left')
        },
        '400': errors.e400,
        '403': errors.e403,
        '500': errors.e500
      },
      // payloadType: 'json',
      security: [{ 'jwt': [] }]
    }
  }
}