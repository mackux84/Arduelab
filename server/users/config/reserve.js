'use strict'

const Joi = require('joi')
const reserveSchema = require('../schemas/reserve')
const verifyUniqueReserve = require('../util/userFunctions').verifyUniqueReserve
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
  /*auth: {
    // Add authentication to this route
    strategy: 'jwt',
    scope: ['User', 'Admin']
  },*/
  pre: [
    // Before the route handler runs, verify that the user is unique
    { method: verifyUniqueReserve }
  ],
  validate: {
    payload: reserveSchema,
    headers: updateUserSchema.headerSchema
  },
  description: 'Create Reservation',
  notes: 'Create Reservation, Date & Hour required',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '201': {
          'description': 'Reservation created, check response with JWT API Token',
          'schema': Joi.object({
            date: Joi.date().iso().required().description('Reserved Date').default(new Date()),
            duration: Joi.number().integer().positive().required().description('Reserved duration').default('1'),
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