'use strict'

const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const payloadSchema = Joi.object({
  identification: Joi.string().allow('').description('Identificador de creador').example('235325425513125312353463'),
  username: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(2).max(30).description('El nombre de usuario debe de ser unico').example('andresvega').optional(),
  email: Joi.string().email().description('Un correo valido (La confirmacion sera enviada por correo electronico)').example('andresvega@email.com'),
  university: Joi.string().regex(/^[a-zA-Z0-9 ]{3,60}$/).min(2).max(60).description('El usuario de la universidad').example('Yale'),
  scope: Joi.string().allow('User', 'Premium','Creator', 'Admin').description('The account scope, enum').example('User'),
  telephone: Joi.string().allow('').regex(/^(\(?\+[0-9]{1,3}\)?)? ?-?\(?[0-9]{1,3}\)? ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\w{1,10}\s?\d{1,6})?/).description('Telefono del creador de experimento').example('800 555 1212'),
  cellphone: Joi.string().allow('').regex(/^(\(?\+[0-9]{1,3}\)?)? ?-?\(?[0-9]{1,3}\)? ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})? ?(\w{1,10}\s?\d{1,6})?/).description('Celular del creador de experimento').example('(311) 555-1212'),  
  isVerified: Joi.boolean().description('Si el usuario tiene un correo valido').example('true')
}).label('Update User')

const paramsSchema = Joi.object({
  // id: Joi.number().integer().required(),
  id: Joi.objectId().required().description('Must match a 24 chars objectid')
})

const headerSchema = Joi.object({
  authorization: Joi.string().required().description('JWT Bearer').default('Bearer {JWT}')
}).unknown()
module.exports = {
  payloadSchema: payloadSchema,
  paramsSchema: paramsSchema,
  headerSchema: headerSchema
}