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
  notes: 'Get information of all Experiments, Require \'Admin\' scope',
  tags: ['api', 'users'],
  plugins: {
    'hapi-swagger': {
      responses: {
        '200': {
          'description': 'Experiments information',
          'schema': Joi.object({
            _id: Joi.objectId().required().description('id').example('123ADBF526DFA896AFC85204'),
            name: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(3).max(30).required().description('Experiment Name').example('Arduino Car'),
            university: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(3).max(30).required().description('Experiment University').example('Yale University'),
            url: Joi.string().min(3).max(30).required().description('The Experiment Url').example('http://google.com'),
            schedule: Joi.array().items(Joi.number()).required().description('The experiment Allowed Hours').example('[8,9,10,11,14,15,16,17,18]'),
            duration: Joi.array().items(Joi.number()).required().description('The experiment Allowed duration in hours').example('[1,2]'),
            enabled: Joi.boolean().required().description('Wheter the Experiment is enabled to registration').example(true)
          }).label('User information')
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