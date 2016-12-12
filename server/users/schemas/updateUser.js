'use strict'

const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)

const payloadSchema = Joi.object({
  username: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(2).max(30).description('El nombre de usuario debe de ser unico').example('andresvega').optional(),
  email: Joi.string().email().description('Un correo valido (La confirmacion sera enviada por correo electronico)').example('andresvega@email.com'),
  university: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(2).max(30).description('El usuario de la universidad').example('Yale'),
  scope: Joi.string().allow('User', 'Premium', 'Admin').description('The account scope, enum').example('User'),
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