'use strict'

const Joi              = require('joi')
const verifyUniqueCreator = require('../util/userFunctions').verifyUniqueCreator
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
  pre: [
    { method: verifyUniqueCreator, assign: 'creator' }
  ],
  validate: {
    params: updateUserSchema.paramsSchema,
    headers: updateUserSchema.headerSchema,
    payload: Joi.object({
      identification: Joi.string().description('Un correo valido (La confirmacion sera enviada por correo electronico)').example('andresvega@email.com'),
      name: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(3).max(30).description('El nombre de usuario debe de ser unico').example('andresvega'),
      email: Joi.string().email().description('Un correo valido (La confirmacion sera enviada por correo electronico)').example('andresvega@email.com'),
      telephone: Joi.string().regex(/^(\(?\+[0-9]{1,3}\)?)? ?-?\(?[0-9]{1,3}\)? ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\w{1,10}\s?\d{1,6})?/).description('Telefono del creador de experimento').example('800 555 1212'),
      cellphone: Joi.string().regex(/^(\(?\+[0-9]{1,3}\)?)? ?-?\(?[0-9]{1,3}\)? ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\w{1,10}\s?\d{1,6})?/).description('Celular del creador de experimento').example('(311) 555-1212'),
    })
  },
  auth: {
    strategy: 'jwt',
    scope: 'Admin'
  },
  description: 'Patch user',
  notes: 'Edit User, Can Edit username, email, scope, and/or university  Require \'Admin\' scope',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'User updated',
          'schema': Joi.object({
            message: Joi.string().required().description('message').default('User updated!')
          }).label('User updated')
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