'use strict'

const Joi = require('joi')

module.exports = {
  e400:            {
    'description': 'Bad Request',
    'schema':      Joi.object({
      statusCode:  Joi.number().required().description('CODIGO DE ERROR').default(400),
      error:       Joi.string().required().description('TIPO DE ERROR').default('Bad Request'),
      message:     Joi.string().required().description('MENSAJE DE ERROR')
    }).label('Bad Request')
  },
  e401:            {
    'description': 'Unauthorized',
    'schema':      Joi.object({
      statusCode:  Joi.number().required().description('CODIGO DE ERROR').default(401),
      error:       Joi.string().required().description('TIPO DE ERROR').default('Unauthorized'),
      message:     Joi.string().required().description('MENSAJE DE ERROR').default('TOKEN INVALIDO')
    }).label('Unauthorized')
  },
  e403:            {
    'description': 'Forbidden',
    'schema':      Joi.object({
      statusCode:  Joi.number().required().description('CODIGO DE ERROR').default(403),
      error:       Joi.string().required().description('TIPO DE ERROR').default('Forbidden'),
      message:     Joi.string().required().description('MENSAJE DE ERROR').default('LINK DE VERIFICACION INVALIDO')
    }).label('Forbidden')
  },
  e404:            {
    'description': 'Not Found',
    'schema':      Joi.object({
      statusCode:  Joi.number().required().description('CODIGO DE ERROR').default(404),
      error:       Joi.string().required().description('TIPO DE ERROR').default('Not Found'),
      message:     Joi.string().required().description('MENSAJE DE ERROR')
    }).label('Not Found')
  },
  e500:            {
    'description': 'internal server error',
    'schema':      Joi.object({
      statusCode:  Joi.number().required().description('CODIGO DE ERROR').default(500),
      error:       Joi.string().required().description('TIPO DE ERROR').default('internal server error'),
      message:     Joi.string().required().description('MENSAJE DE ERROR')
    }).label('internal server error')
  },
  e503:            {
    'description': 'Service Unavailable',
    'schema':      Joi.object({
      statusCode:  Joi.number().required().description('CODIGO DE ERROR').default(503),
      error:       Joi.string().required().description('TIPO DE ERROR').default('Service Unavailable'),
      message:     Joi.string().required().description('MENSAJE DE ERROR').default('INTENTE NUEVAMENTEN MAS TARDE')  
    }).label('SERVICIO NO DISPONIBLE')
  }
}