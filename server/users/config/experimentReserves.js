'use strict'

const Joi              = require('joi')
const updateUserSchema = require('../schemas/updateUser')
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
  auth: {
    // Add authentication to this route
    // The user must have a scope of `admin`
    strategy: 'jwt',
    scope: ['User', 'Admin']
  },
  validate: {
    headers: updateUserSchema.headerSchema,
    payload: Joi.object({
      expID: Joi.objectId().required().description('Debe coincidir con los 24 caracteres del ObjectID')
    }).label('Debe coincidir con los 24 caracteres del ObjectID')
  },
  description: 'Get current experiment reserves information',
  notes: 'Obtiene todas las reservas del experimento requerido',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Informacion de la reserva del experimento',
          'schema': Joi.object([{
            date:     Joi.date().iso().required().description('Fecha de reserva').default(new Date()),
            duration: Joi.number().integer().positive().required().description('Duracion de la reserva').default('1'),
            token:    Joi.string().required().description('jwt').example('hbGciOiJIUzI1NiIsInR5cCI6kpVCJ9eyJoYXNoIjoiNGI4OZiZDZlMzM5YTcyMJOWIxZjhjMzM0ODIxNzI1OGZOD1N2FmN2Y3MzQxMzgzYjEyMzYzNNjZjNDBlNDNmZmQ2YmY4NTZhZjY2OTBjMmU1MWI1N2YyIiwiaWF0IjocyNTk2NTE3LCJleHAOjE0NzI2MDxMTd9HL7yOlzW4KJz5qMhMs9lKAlOyavRXdlk6uXQ').label('jwt'),
            used:     Joi.boolean().required().description('Si la reserva ya fue usada').example(true)
          }]).label('Informacion de Usuario')
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