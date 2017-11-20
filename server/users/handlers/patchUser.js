'use strict'

const Boom        = require('boom')
const createToken = require('../util/userFunctions').createToken
const Common      = require('../util/common')
const User        = require('../models/User')

module.exports = function (request, reply) {
  const id = request.params.id
  //////////////////////////////////
  
  
  
//////////////////////////////////////////
  User
    .findOneAndUpdate({ _id: id }, request.pre.user, (error, user) => {
      if (error) {
        reply(Boom.badRequest(error))
        return
      }
      if (!user) {
        reply(Boom.notFound('User id=(' + request.params.id + ') not found!'))
        return
      }
      if (request.payload.email) {
        // send verification email to the new email if the email was updated
        var tokenData = {
          email: user.email,
          university: user.university,
          scope: [user.scope],
          id: user._id
        }
      }
      
      if ( !request.pre.user.isVerified && user.isVerified){
        var exec = require('child_process').exec
        exec('echo "CUENTA VERIFICADA, EL USUARIO ' + user.email + ' HA SIDO VERIFICADO SATISFACTORIAMENTE \n\n\nUTILICE SUS CREDENCIALES PARA INGRESAR AL SITIO \n\n\n\n ARDUELAB TEAM" | mail -s "CUENTA VERIFICADA "'+user.email)          
      }
      reply({message: 'User updated!'})
      
    })
  }