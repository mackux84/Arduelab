'use strict'

//Import Handlers
const createUserHandler              = require('../users/handlers/createUser')
const authenticateUserHandler        = require('../users/handlers/authenticateUser')
const resendVerificationEmailHandler = require('../users/handlers/resendVerificationEmail')
const forgotPasswordHandler          = require('../users/handlers/forgotPassword')
const verifyEmailHandler             = require('../users/handlers/verifyEmail')
const patchUserHandler               = require('../users/handlers/patchUser')
const getAllUsersHandler             = require('../users/handlers/getAllUsers')
const workbenchHandler               = require('../users/handlers/workbench')
const accountHandler                 = require('../users/handlers/account')
const reserveHandler                 = require('../users/handlers/reserve')
const checkTimeHandler               = require('../users/handlers/checkTime')
const getReservasHandler             = require('../users/handlers/getReservas')
const reservasAdminHandler           = require('../users/handlers/reservasAdmin')
const patchReservaHandler            = require('../users/handlers/patchReserva')
const createExpHandler               = require('../users/handlers/createExp')
const experimentsAdminHandler        = require('../users/handlers/experimentsAdmin')
const patchExperimentHandler         = require('../users/handlers/patchExperiment')
const workbenchCheckHandler          = require('../users/handlers/workbenchCheck')
const experimentReservesHandler      = require('../users/handlers/experimentReserves')

//Import Configs
const createUserConfig               = require('../users/config/createUser')
const authenticateUserConfig         = require('../users/config/authenticateUser')
const resendVerificationEmailConfig  = require('../users/config/resendVerificationEmail')
const forgotPasswordConfig           = require('../users/config/forgotPassword')
const verifyEmailConfig              = require('../users/config/verifyEmail')
const patchUserConfig                = require('../users/config/patchUser')
const getAllUsersConfig              = require('../users/config/getAllUsers')
const checkUserConfig                = require('../users/config/checkUser')
const workbenchConfig                = require('../users/config/workbench')
const accountConfig                  = require('../users/config/account')
const reserveConfig                  = require('../users/config/reserve')
const checkTimeConfig                = require('../users/config/checkTime')
const getReservasConfig              = require('../users/config/getReservas')
const reservasAdminConfig            = require('../users/config/reservasAdmin')
const patchReservaConfig             = require('../users/config/patchReserva')
const createExpConfig                = require('../users/config/createExp')
const experimentsAdminConfig         = require('../users/config/experimentsAdmin')
const patchExperimentConfig          = require('../users/config/patchExperiment')
const workbenchCheckConfig           = require('../users/config/workbenchCheck')
const experimentReservesConfig       = require('../users/config/experimentReserves')


module.exports = [
  {
    method:  'POST',
    path:    '/users',
    config:  createUserConfig,
    handler: createUserHandler   
  },
  {
    method:  'POST',
    path:    '/users/authenticate',
    config:  authenticateUserConfig,
    handler: authenticateUserHandler
  },
  {
    method:  'POST',
    path:    '/users/resendVerificationEmail',
    config:  resendVerificationEmailConfig ,
    handler: resendVerificationEmailHandler
  },
  {
    method:  'POST',
    path:    '/users/forgotPassword',
    config:  forgotPasswordConfig,
    handler: forgotPasswordHandler 
  },
  {
    method:  'GET',
    path:    '/users/verifyEmail/{token}',
    config:  verifyEmailConfig,
    handler: verifyEmailHandler   
  },
  {
    method:  'PATCH',
    path:    '/users/{id}',
    config:  patchUserConfig,
    handler: patchUserHandler
  },
  {
    method:  'POST',
    path:    '/users/getAllUsers',
    config:  getAllUsersConfig,
    handler: getAllUsersHandler
  },
  {
    method:  'POST',
    path:    '/users/check',
    config:  checkUserConfig,
    handler: (request, reply) => {
      reply(request.pre.user)
    }
  },
  /*{
    method:  'GET',
    path:    '/users/workbench/{token}',
    config:  workbenchConfig,
    handler: workbenchHandler
  },*/
  {
    method:  'GET',
    path:    '/users/account/{token}',
    config:  accountConfig,
    handler: accountHandler
  },
  {
    method:  'POST',
    path:    '/users/reserve',
    config:  reserveConfig,
    handler: reserveHandler
  },
  {
    method:  'POST',
    path:    '/users/checkTime',
    config:  checkTimeConfig,
    handler: checkTimeHandler
  },
  {
    method:  'POST',
    path:    '/users/reservas',
    config:  getReservasConfig,
    handler: getReservasHandler
  },
  {
    method: 'POST',
    path: '/users/reservasAdmin',
    config: reservasAdminConfig,
    handler: reservasAdminHandler
  },
  {
    method:  'PATCH',
    path:    '/users/reservas/{id}',
    config:  patchReservaConfig,
    handler: patchReservaHandler
  },
  {
    method: 'POST',
    path: '/users/createexp',
    config: createExpConfig,
    handler: createExpHandler
  },
  {
    method: 'POST',
    path: '/users/experimentsAdmin',
    config: experimentsAdminConfig,
    handler: experimentsAdminHandler
  },
  {
    method:  'PATCH',
    path:    '/users/experiment/{id}',
    config:  patchExperimentConfig,
    handler: patchExperimentHandler
  }, 
  {
    method: 'POST',
    path: '/users/workbenchCheck/{id}',
    config: workbenchCheckConfig,
    handler: workbenchCheckHandler
  },
  {
    method: 'POST',
    path: '/users/experimentReserves',
    config: experimentReservesConfig,
    handler: experimentReservesHandler
  },
]
