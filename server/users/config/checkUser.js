'use strict'

const Joi              = require('joi')
const verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser
const checkUserSchema  = require('../schemas/checkUser')
const errors           = require('../../config/errors')

module.exports = {
  payload: {
    output: 'data',
    parse: true,
    allow: 'application/json'
  // maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
  // uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
  },
  auth: false,
  pre: [
    { method: verifyUniqueUser, assign: 'user' }
  ],
  validate: {
    // Validate the payload against the Joi schema
    payload: checkUserSchema
  },
  description: 'Check user information',
  notes: 'Check if the email is already taken',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'User information',
          'schema': Joi.object({
            email: Joi.string().required().email().description('A valid Email (confirmation email will be sent)').example('andresvega@email.com')
          }).label('User information')
        },
        '400': errors.e400,
        '500': errors.e500
      },
      payloadType: 'json',
    // security: [{ 'jwt': [] }]
    }
  }
}