'use strict'

const Joi = require('joi')
const verifyUniqueCreator = require('../util/userFunctions').verifyUniqueCreator
const errors = require('../../config/errors')
const updateUserSchema = require('../schemas/updateUser')
Joi.objectId = require('joi-objectid')(Joi)

module.exports = {
  payload: {
    output: 'data',
    parse: true,
    allow: 'application/json'
    // maxBytes - limits the size of incoming payloads to the specified byte count. Allowing very large payloads may cause the server to run out of memory. Defaults to 1048576 (1MB).
    // uploads - the directory used for writing file uploads. Defaults to os.tmpDir().
  },
  auth: {
    // Add authentication to this route
    strategy: 'jwt',
    scope: ['Creator','Admin']
  },
  pre: [
    // Before the route handler runs, verify that the user is unique
    { method: verifyUniqueCreator }
  ],
  validate: {
    headers: updateUserSchema.headerSchema,
    payload: Joi.object({
      name: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(3).max(30).required().description('Nombre del experimento').example('Uso sensores de movimiento'),
      university: Joi.string().regex(/^[a-zA-Z0-9 ]{3,60}$/).min(3).max(60).required().description('Universidad del experimento').example('Universidad Autonoma del Caribe'),
      city: Joi.string().regex(/^[a-zA-Z0-9 ]{3,60}$/).min(3).max(60).required().description('Ciudad del experimento').example('Barranquilla'),
      country: Joi.string().regex(/^[a-zA-Z0-9 ]{3,60}$/).min(3).max(60).required().description('País del experimento').example('Colombia'),
      idCreator: Joi.objectId().required().description('Identificador de creador').example('235325425513125312353463'),
      docCreator: Joi.string().required().description('Documento de identidad del creador').example('8859236584'),
      arduino: Joi.string().min(3).required().description('Arduino usado en el experimento').example('Arduino Mega 2560'),
      image: Joi.string().min(3).required().description('Link de la Imagen').example('http://i.imgur.com/mG1n223.gif'),
      url: Joi.string().min(3).required().description('Enlace del experimento').example('192.168.0.1:5001'),
      days: Joi.array().items(Joi.number().min(0).max(6)).required().description('Los dias permitidos por el experimento, donde 0 es Domingo, 1 es Lunes, y asi sucesivamente').example('[1,2,3,4]'),
      schedule: Joi.array().length(2).items(Joi.number().min(0).max(24)).required().description('Las horas activas del experimento (inicio,fin) formato 24h').example('[8,18]'),
      duration: Joi.array().items(Joi.number().multiple(30)).required().description('Duraciones permitidas en el experimento en minutos, multiplos de 30').example('[30,60,90,120]'),
      enabled: Joi.boolean().required().description('Si el experimento esta disponible a los usuarios o no').example(true),
      description: Joi.string().max(250).required().description('Descripcion del experimento').example('Programacion de sensores en placa Arduino NANO, ejercicios basicos'),
      pdffile: Joi.string().required().description('Nombre del Archivo PDF (subido con anterioridad)').example('Programacion de sensores en placa Arduino NANO, ejercicios basicos.pdf')
    })
  },
  description: 'Create Experiment',
  notes: 'Creacion de experimentos',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '201': {
          'description': 'Experimento Creado',
          'schema': Joi.object({
            message: Joi.string().required().description('Experimento Creado').default('Experimento Creado'),
          }).label('Experimento Creado')
        },
        '400': errors.e400,
        '403': errors.e403,
        '500': errors.e500
      },
      payloadType: 'json',
      security: [{ 'jwt': [] }]
    }
  }
}