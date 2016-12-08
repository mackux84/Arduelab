'use strict'

const Joi = require('joi')

const authenticateUserSchema = Joi.object({
  email:    Joi.string().email().required().description('A valid Email (confirmation email will be sent)').example('andresvega@email.com'),
  password: Joi.string().required().description('A secure password is recommended').example('AV1578sj')
}).label('Authenticate Email & password')

module.exports = authenticateUserSchema
