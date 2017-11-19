'use strict'

const Joi = require('joi')

const createUserSchema = Joi.object({
  username:       Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(3).max(30).required().description('El nombre de usuario debe de ser unico').example('andresvega'),
  email:          Joi.string().email().required().description('Un correo valido (La confirmacion sera enviada por correo electronico)').example('andresvega@email.com'),
  university:     Joi.string().regex(/^[a-zA-Z0-9 ]{3,60}$/).min(3).max(60).required().description('El usuario de la uniersidad').example('Yale'),
  password:       Joi.string().required().description('Una contraseña segura es recomendada').example('AV1578sj'),
  telephone:      Joi.string().regex(/^((\(?\+?[0-9]{1,3}\)?)?( |-)?([0-9]{1,3}?)( |-)?)?( |-)?([0-9]{2,3})( |-)?([0-9]{2,5})( |-)?([0-9]{2,5}) ?([a-zA-Z]{1,10}\s?\d{1,6})?$/).description('Telefono del creador de experimento').example('800 555 1212'),
  cellphone:      Joi.string().regex(/^((\(?\+?[0-9]{1,3}\)?)?( |-)?([0-9]{1,3}?)( |-)?)?( |-)?([0-9]{2,3})( |-)?([0-9]{2,5})( |-)?([0-9]{2,5}) ?([a-zA-Z]{1,10}\s?\d{1,6})?$/).description('Celular del creador de experimento').example('(311) 555-1212'),
  identification: Joi.string().description('Un correo valido (La confirmacion sera enviada por correo electronico)').example('andresvega@email.com'),

}).label('Create user Schema')

module.exports = createUserSchema