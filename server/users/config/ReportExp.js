'use strict'

const Joi = require('joi')
const updateUserSchema = require('../schemas/updateUser')
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
    scope: ['User', 'Admin', 'Creator']
  },
  validate: {
    headers: updateUserSchema.headerSchema,
    // Validate the payload against the Joi schema
    payload: Joi.object({
      userID: Joi.string().required().description('Identificador del usuario que reporta').example('235325425513125312353463'),
      expID: Joi.string().required().description('Identificador del experimento reportado').example('235325425513125312353463'),
      username: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(3).max(30).required().description('El nombre de usuario debe de ser unico').example('andresvega'),
      email: Joi.string().email().required().description('Un correo valido (La confirmacion sera enviada por correo electronico)').example('andresvega@email.com'),
      report: Joi.string().required().description('Motivo del reporte de errores').example('Servidor caido'),
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
            message: Joi.string().required().description('Mensaje de Aprovacion').default('Por favor verifica tu cuenta presionando en el enlace que se encuentra en el correo electronico')
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