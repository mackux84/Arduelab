'use strict'

const Joi = require('joi')
const updateUserSchema = require('../schemas/updateUser')
const errors = require('../../config/errors')

module.exports = {
  auth: {
    // Add authentication to this route
    // The user must have a scope of `admin`
    strategy: 'jwt',
    scope: ['User', 'Admin']
  },
  validate: {
    headers: updateUserSchema.headerSchema
  },
  description: 'Get current user reserves information',
  notes: 'Obtiene la informacion de todas las reservas del usuario',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'User reserves information',
          'schema': Joi.object([{
            date: Joi.date().iso().required().description('Reserved Date').default(new Date()),
            duration: Joi.number().integer().positive().required().description('Reserved duration').default('1'),
            token: Joi.string().required().description('jwt').example('hbGciOiJIUzI1NiIsInR5cCI6kpVCJ9eyJoYXNoIjoiNGI4OZiZDZlMzM5YTcyMJOWIxZjhjMzM0ODIxNzI1OGZOD1N2FmN2Y3MzQxMzgzYjEyMzYzNNjZjNDBlNDNmZmQ2YmY4NTZhZjY2OTBjMmU1MWI1N2YyIiwiaWF0IjocyNTk2NTE3LCJleHAOjE0NzI2MDxMTd9HL7yOlzW4KJz5qMhMs9lKAlOyavRXdlk6uXQ').label('jwt'),
            used: Joi.boolean().required().description('If the reserve is used').example(true)
          }]).label('User information')
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