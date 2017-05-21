'use strict'

const Joi = require('joi')
const errors = require('../../config/errors')
const updateUserSchema = require('../schemas/updateUser')
Joi.objectId = require('joi-objectid')(Joi)

module.exports = {
  payload: {
    output: 'stream',
    parse: true,
    allow: 'multipart/form-data',
    uploads: 'up_files',
    timeout: 30034,
    failAction: 'log',
    maxBytes: 30 * Math.pow( 1024, 2 )
    // maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
    // uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
  },
  auth: {
    // Add authentication to this route
    strategy: 'jwt',
    scope: ['Creator','Admin']
  },
  validate: {
    headers: updateUserSchema.headerSchema,

  },
  description: 'Upload PDF',
  notes: 'Upload PDF',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '201': {
          'description': 'PDF Enviado',
          'schema': Joi.object({
            message: Joi.string().required().description('PDF Enviado').default('PDF Enviado'),
          }).label('PDF Enviado')
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