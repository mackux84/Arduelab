'use strict'

const Joi = require('joi')

const createUserSchema = Joi.object({
  username:   Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(3).max(30).required().description('El nombre de usuario debe de ser unico').example('andresvega'),
  email:      Joi.string().email().required().description('Un correo valido (La confirmacion sera enviada por correo electronico)').example('andresvega@email.com'),
  university: Joi.string().regex(/^[a-zA-Z0-9 ]{3,60}$/).min(3).max(30).required().description('El usuario de la uniersidad').example('Yale'),
  password:   Joi.string().required().description('Una contraseña segura es recomendada').example('AV1578sj'),
}).label('Create user Schema')

module.exports = createUserSchema