'use strict'

const Joi = require('joi')

const checkUserSchema =Joi.object({
  email: Joi.string().email().required().description('A valid Email (confirmation email will be sent)').example('andresvega@email.com'),
}).label('Check User with Email')
 
module.exports = checkUserSchema
