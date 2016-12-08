'use strict'

const Joi              = require('joi')
const verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser
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
      enabled: Joi.boolean().required().description('whether the reserve is enabled or disabled')
    })
  },
  auth: {
    strategy: 'jwt',
    scope: 'Admin'
  },
  description: 'Patch reserve',
  notes: 'Enable/Disable Reserve Require \'Admin\' scope',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Reserve updated',
          'schema': Joi.object({
            message: Joi.string().required().description('message').default('Reserve updated!')
          }).label('Reserve updated')
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