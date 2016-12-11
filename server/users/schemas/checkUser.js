'use strict'

const Joi = require('joi')

const checkUserSchema =Joi.object({
  email: Joi.string().email().required().description('Correo electornico valido (Recuerda que aqui te llegara el link de activacion)').example('andresvega@email.com'),
}).label('Verificar si el correo electronico del usuario ya existe')
 
module.exports = checkUserSchema
