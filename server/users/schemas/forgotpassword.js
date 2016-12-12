<<<<<<< HEAD
'use strict'

const Joi = require('joi')

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().description('A valid Email (confirmation email will be sent)').example('andresvega@email.com'),
}).label('Forgot Password with Email')

module.exports = forgotPasswordSchema
=======
'use strict'

const Joi = require('joi')

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().description('Un correo valido (La confirmacion sera enviada por correo electronico)').example('andresvega@email.com'),
}).label('Forgot Password with Email')

module.exports = forgotPasswordSchema
>>>>>>> 200bb431688009a07abb3a906c0e7c2c3f4e4129
