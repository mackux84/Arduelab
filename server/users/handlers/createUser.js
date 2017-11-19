'use strict'

const Boom   = require('boom')
const User   = require('../models/User')
const Common = require('../util/common')
// const createToken = require('../util/userFunctions').createToken

// had some errors with bcrypt on windows
// function hashPassword(password, cb){
//   // Generate a salt at level 10 strength
//   bcrypt.genSalt(10, (error, salt) => {
//     bcrypt.hash(password, salt, (error, hash) => {
//       return cb(error, hash)
//     })
//   })
// }

module.exports = function (request, reply) {
  let user            = new User()
  user.identification = request.payload.identification
  user.email          = request.payload.email
  user.username       = request.payload.username
  user.university     = request.payload.university
  user.telephone      = request.payload.telephone
  user.cellphone      = request.payload.cellphone
  if (request.payload.identification) {
    user.scope = 'Creator'
  } else {
    user.scope = 'User'
  }

  user.password = Common.encrypt(request.payload.password),
    // hashPassword(req.payload.password, (error, hash) => {
    // if (error){
    //     reply( Boom.badRequest(error))
    //     return
    // }
    // user.password = hash
    user.save((error, user) => {
      if (!error) {

        /*var tokenData = {
          email: user.email,
          university: user.university,
          scope: [user.scope],
          id: user._id
        }*/

        reply({ message: 'EL ADMINISTRADOR VERIFICARA TU SOLICITUD, DE 48 A 72 HORAS SE TE DARA RESPUESTA VIA CORREO ELECTRONICO' })
        exec('echo "CREACION DE USUARIO NUEVO ' + user.email + '\nNOMBRE: ' + user.username + '\nFAVOR INGRESAR A LA PLATAFORMA PARA VERIFICAR EL USUARIO" | mail -s "NUEVO USUARIO CREADO TIPO :' + user.scope+'" arduinserver@gmail.com')
        /*Common.sentMailVerificationLink(user, createToken(tokenData), (error) => {
          if (error) {
            reply(Boom.serverUnavailable('INTENTE DE NUEVO MAS TARDE'))
            return
          }
         
        })*/

      } else {
        if (11000 === error.code || 11001 === error.code) {
          reply(Boom.forbidden('POR FAVOR INGRESE OTRO CORREO ELECTRONICO, ESTE YA SE ENCUENTRA EN USO'))
        } else {
          console.log(error)
          reply(Boom.forbidden(error)) // HTTP 403 //why?
        }
      }
    })
  // })
}