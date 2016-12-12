'use strict'

const Joi = require('joi')

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().description('A valid Email (confirmation email will be sent)').example('andresvega@email.com'),
}).label('Forgot Password with Email')

module.exports = forgotPasswordSchema
