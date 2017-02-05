'use strict'

const Joi              = require('joi')
const updateUserSchema = require('../schemas/updateUser')
const errors           = require('../../config/errors')

module.exports = {
  auth: {
    // Add authentication to this route
    // The user must have a scope of `admin`
    strategy: 'jwt',
    scope: 'Admin'
  },
  validate: {
    headers: updateUserSchema.headerSchema
  },
  description: 'Get all users information',
  notes: 'Get information of all users, except password and version Require \'Admin\' scope',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Users information',
          'schema': Joi.object([{
            _id: Joi.objectId().required().description('id').example('123ADBF526DFA896AFC85204'),
            scope: Joi.string().required().allow('User', 'Premium', 'Admin').description('El tipo de cuenta').example('User'),
            username: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(2).max(30).required().description('El usuario debe ser unico (correo electronico)').example('andresvega'),
            email: Joi.string().required().email().description('Un correo valido (sera enviado un correo de verificacion)').example('andresvega@email.com'),
            university: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(2).max(30).required().description('La universidad al cual pertenece el usuario').example('Yale'),
            isVerified: Joi.boolean().required().description('Si el correo es verificado o si el administrador verifica la cuenta').example(true)
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