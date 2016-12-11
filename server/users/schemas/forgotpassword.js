'use strict'

const Joi = require('joi')

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().description('Un correo valido (La confirmacion sera enviada por correo electronico)').example('andresvega@email.com'),
}).label('Forgot Password with Email')

module.exports = forgotPasswordSchema
