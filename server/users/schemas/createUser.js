'use strict'

const Joi = require('joi')

const createUserSchema = Joi.object({
  username:   Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(3).max(30).required().description('The user unique Username').example('andresvega'),
  email:      Joi.string().email().required().description('A valid Email (confirmation email will be sent)').example('andresvega@email.com'),
  university: Joi.string().regex(/^[a-zA-Z0-9 ]{3,30}$/).min(3).max(30).required().description('The user University').example('Yale'),
  password:   Joi.string().required().description('A secure password is recommended').example('AV1578sj'),
}).label('Create user Schema')

module.exports = createUserSchema
