'use strict'

const Joi              = require('joi')
const updateUserSchema = require('../schemas/updateUser')
const errors           = require('../../config/errors')

module.exports = {
  auth: {
    // Add authentication to this route
    // The user must have a scope of `admin`
    strategy: 'jwt',
    scope: ['User','Admin']
  },
  validate: {
    headers: updateUserSchema.headerSchema
  },
  description: 'Get all Experiments information',
  notes: 'Obtiene la informacion de todos los experimentos, requiere privilegios de administrador (scope: Admin)',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Experiments information',
          'schema': Joi.object({
            _id: Joi.objectId().required().description('id').example('123ADBF526DFA896AFC85204'),
            name: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(3).max(30).required().description('Nombre del experimento').example('Uso sensores de movimiento'),
            university: Joi.string().regex(/^[a-zA-Z0-9 ]{3,60}$/).min(3).max(60).required().description('Universidad del experimento').example('Universidad Autonoma del Caribe'),
            url: Joi.string().min(3).max(30).required().description('Enlace del experimento').example('http://192.168.0.1:5001'),
            days: Joi.array().items(Joi.number().min(0).max(6)).required().description('Los dias permitidos por el experimento, donde 0 es Domingo, 1 es Lunes, y asi sucesivamente').example('[1,2,3,4]'),
            schedule: Joi.array().length(2).items(Joi.number().min(0).max(23)).required().description('Las horas activas del experimento (inicio,fin) formato 24h').example('[8,18]'),
            duration: Joi.array().items(Joi.number().multiple(30)).required().description('Duraciones permitidas en el experimento en minutos, multiplos de 30').example('[30,60,90,120]'),
            enabled: Joi.boolean().required().description('Si el experimento esta disponible a los usuarios o no').example(true),
            description: Joi.string().description('Descripcion del experimento').example('Programacion de sensores en placa Arduino NANO, ejercicios basicos')
          }).label('Informacion de Usuario')
        },
        '400': errors.e400,
        '401': errors.e401,
        '404': errors.e404,
        '500': errors.e500
      },
      payloadType: 'json',
      security: [{ 'jwt': [] }]
    }
  }
}