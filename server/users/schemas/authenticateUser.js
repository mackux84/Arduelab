'use strict'

const Joi = require('joi')

const authenticateUserSchema = Joi.object({
  email:    Joi.string().email().required().description('Correo electornico valido (Recuerda que aqui te llegara el link de activacion)').example('ijimenez@email.com'),
  password: Joi.string().required().description('Se recomienda una contraseña segura').example('T04d9!0¡')
}).label('Verifique correo electronio o contraseña')

module.exports = authenticateUserSchema
