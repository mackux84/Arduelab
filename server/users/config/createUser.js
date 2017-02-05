'use strict'

const Joi              = require('joi')
const verifyUniqueUser = require('../util/userFunctions').verifyUniqueUser
const createUserSchema = require('../schemas/createUser')
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
  // auth: {
  //   strategy: 'jwt',
  // },
  pre: [
    // Before the route handler runs, verify that the user is unique
    { method: verifyUniqueUser }
  ],
  validate: {
    // Validate the payload against the Joi schema
    payload: createUserSchema
  },
  description: 'Create a new User',
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