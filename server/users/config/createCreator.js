'use strict'

const Joi = require('joi')
const verifyUniqueCreator = require('../util/userFunctions').verifyUniqueCreator
const errors = require('../../config/errors')

module.exports = {
  payload: {
    output: 'data',
    parse: true,
    allow: 'application/json'
    // maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
    // uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
  },
  auth: {
    strategy: 'jwt',
    scope: ['Admin']
  },
  pre: [
    // Before the route handler runs, verify that the user is unique
    { method: verifyUniqueCreator }
  ],
  validate: {
    // Validate the payload against the Joi schema
    payload: Joi.object({
      identification: Joi.string().required().description('Identificador de creador').example('235325425513125312353463'),
      name: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(3).max(30).required().description('El nombre de usuario debe de ser unico').example('andresvega'),
      email: Joi.string().email().required().description('Un correo valido (La confirmacion sera enviada por correo electronico)').example('andresvega@email.com'),
      telephone: Joi.string().regex(/^((\(?\+?[0-9]{1,3}\)?)?( |-)?([0-9]{1,3}?)( |-)?)?( |-)?([0-9]{2,3})( |-)?([0-9]{2,5})( |-)?([0-9]{2,5}) ?([a-zA-Z]{1,10}\s?\d{1,6})?$/).required().description('Telefono del creador de experimento').example('800 555 1212'),
      cellphone: Joi.string().regex(/^((\(?\+?[0-9]{1,3}\)?)?( |-)?([0-9]{1,3}?)( |-)?)?( |-)?([0-9]{2,3})( |-)?([0-9]{2,5})( |-)?([0-9]{2,5}) ?([a-zA-Z]{1,10}\s?\d{1,6})?$/).required().description('Celular del creador de experimento').example('(311) 555-1212'),
    })
  },
  description: 'Create a new Creator',
  notes: 'Crea un nuevo usuario con todos los parametros requeridos, se requiere un correo electronico para la verificacion de la cuenta, o autorizacion del administradoe',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Cuenta creada, favor verificar el correo o espere que el Administrador active la cuenta',
          'schema': Joi.object({
            message: Joi.string().required().description('Mensaje de Aprobacion').default('Por favor verifica tu cuenta presionando en el enlace que se encuentra en el correo electronico')
          }).label('Correcto')
        },
        '400': errors.e400,
        '500': errors.e500,
        '503': errors.e503
      },
      payloadType: 'json',
      // security: [{ 'jwt': [] }]
    }
  }
}