'use strict'

const Joi                  = require('joi')
const forgotPasswordSchema = require('../schemas/forgotpassword.js')
const errors               = require('../../config/errors')

module.exports = {
  payload: {
    output: 'data',
    parse: true,
    allow: 'application/json'
  // maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
  // uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
  },
  auth: false,
  validate: {
    payload: forgotPasswordSchema
  },
  description: 'Forgot Password',
  notes: 'Envia el link de RESET de password en caso de olvido',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Link de RESET de password enviado al correo registrado',
          'schema': Joi.object({
            message: Joi.string().required().description('message').default('Link de RESET de password enviado al correo registrado')
          }).label('Correo de verificacion enviado')
        },
        '400': errors.e400,
        '403': errors.e403,
        '500': errors.e500,
        '503': errors.e503
      },
      payloadType: 'json',
    // security: [{ 'jwt': [] }]
    }
  }
}