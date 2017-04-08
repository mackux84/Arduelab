'use strict'

const Boom      = require('boom')
const User      = require('../models/User')
const Reserve = require('../models/Reserve')
const Creator = require('../models/Creator')
// const Jwt    = require('jsonwebtoken')
const Common    = require('./common')
// const bcrypt = require('bcrypt')

function verifyUniqueUser (request, reply) {
  // Find an entry from the database that matches the email
  User.findOne({
    email: request.payload.email 
  }, (err, user) => {
    // Check whether the email is already taken and error out if so
    if (user) {
      if (user.email === request.payload.email) {
        reply(Boom.badRequest('ESTE CORREO ELECTRONICO YA SE ENCUENTRA EN USO'))
        return
      }
    }
    // If everything checks out, send the payload through to the route handler
    reply(request.payload)
  })
}
function verifyUniqueCreator (request, reply) {
  // Find an entry from the database that matches the email
  Creator.findOne({
    identification: request.payload.identification
  }, (err, user) => {
    // Check whether the email is already taken and error out if so
    if (user) {
      if (user.identification === request.payload.identification) {
        reply(Boom.badRequest('ESTA IDENTIFICACION YA SE ENCUENTRA EN USO'))
        return
      }
    }
    // If everything checks out, send the payload through to the route handler
    reply(request.payload)
  })
}

function verifyUniqueReserve (request, reply) {
  var date = new Date(request.payload.start)
  Reserve.findOne({
    initialDate: date,
    enabled: true,
    idExp: request.payload.experiment
  }, (err, reserve) => {
    // Check if the reserve exists
    if (reserve) {
      reply(Boom.badRequest('UNA RESERVA PARA ESE ESPACIO DE TIEMPO YA SE ENCUNTRA TOMADA'))
      return
    }
    // If everything checks out, send the payload through to the route handler
    reply(request.payload)
  })
}
function verifyCredentials (request, reply) {
  // const password = request.payload.password
  // Find an entry from the database that matches the email
  User.findOne({
    email: request.payload.email
  }, (err, user) => {
    //     if (user){
    //   bcrypt.compare(password, user.password, (err, isValid) => {
    //     if (isValid){
    //       res(user)
    //     }
    //     else {
    //       res(Boom.badRequest('Incorrect password!'))
    //     }
    //   })
    // }else{
    //   res(Boom.badRequest('Incorrect username or email!'))
    // }
    if (!err) {
      if (user === null) {
        reply(Boom.forbidden('USUARIO O CONTRASEÑA INCORRECTOS'))
        return
      }
      if (request.payload.password === Common.decrypt(user.password)) {
        if (!user.isVerified) {
          reply('SU CUENTA DE CORREO AUN NO SE ENCUENTRA VERIFICADA, REVISE SU CORREO ELECTRONICO O CONTACTE AL ADMININSTRADOR')
          return
        }
        reply(user)
      }else {
        reply(Boom.forbidden('NOMBRE DE USUARIO O CONTRASEÑA INVALIDOS'))
      }
    }else {
      if (11000 === err.code || 11001 === err.code) {
        reply(Boom.forbidden('POR FAVOR INGRESE OTRA CUENTA DE CORREO ELECTRONICO, LA SUMINISTRADA YA SE ENCUENTRA EN USO'))
      }else {
        console.error(err)
        reply(Boom.badImplementation(err))
        return
      }
    }
  })
}
function createToken (tokenData) {
  let Jwt = require('jsonwebtoken')
  let key = require('../../config/auth').key
  let a = Common.encrypt('' + tokenData.email)
  let b = Common.encrypt('' + tokenData.scope)
  let c = Common.encrypt('' + tokenData.id)
  let d = a + ';' + b + ';' + c
  let e = Common.encrypt('' + d)
  let f = { hash: e, type:'user' }
  return Jwt.sign(f, key.privateKey, { algorithm: 'HS256', expiresIn: key.tokenExpiry })
}
function createToken2 (tokenData) {
  let Jwt = require('jsonwebtoken')
  let moment = require('moment')
  let key = require('../../config/auth').key
  let a = Common.encrypt('' + tokenData.minuto)
  let b = Common.encrypt('' + tokenData.hora)
  let c = Common.encrypt('' + tokenData.dia)
  let d = Common.encrypt('' + tokenData.mes)
  let e = Common.encrypt('' + tokenData.anio)
  let f = Common.encrypt('' + tokenData.duracion)
  let g = Common.encrypt('' + tokenData.experimento)
  let h = a + ';' + b + ';' + c + ';' + d + ';' + e + ';' + f + ';' + g
  let i = Common.encrypt('' + h)
  var initial = moment(tokenData.hora + ':' + tokenData.minuto + ':00-'+tokenData.dia+'-'+(tokenData.mes+1)+'-'+tokenData.anio, 'HH:mm:ss-DD-MM-YYYY').unix()
  let j = { hash: i, type: 'workbench', iat: initial }
  let expires= tokenData.duracion * 60 * 1000 //minutos*segundos*miliseg
  return Jwt.sign(j, key.privateKey, { algorithm: 'HS256', expiresIn: expires })
}
function decyptToken (token) {
  let hash = token.hash
  let a = Common.decrypt(hash)
  let b = a.split(';')
  let email = Common.decrypt(b[0])
  let scope = Common.decrypt(b[1])
  let id = Common.decrypt(b[2])
  let decoded = {
    email: email,
    scope: scope,
    id: id,
    iat: token.iat,
    exp: token.exp,
    type: token.type
  }
  return decoded
}
function decyptToken2 (token) {
  let hash = token.hash
  let a = Common.decrypt(hash)
  let b = a.split(';')
  let minuto = Common.decrypt(b[0])
  let hora = Common.decrypt(b[1])
  let dia = Common.decrypt(b[2])
  let mes = Common.decrypt(b[3])
  let anio = Common.decrypt(b[4])
  let duracion = Common.decrypt(b[5])
  let idExp = Common.decrypt(b[6])

  let decoded = {
    minuto: minuto,
    hora: hora,
    dia: dia,
    mes: mes,
    anio: anio,
    duracion: duracion,
    experimento:idExp,
    iat: token.iat,
    exp: token.exp,
    type: token.type
  }
  return decoded
}
module.exports = {
  verifyUniqueUser:    verifyUniqueUser,
  verifyUniqueReserve: verifyUniqueReserve,
  verifyCredentials:   verifyCredentials,
  createToken:         createToken,
  createToken2:        createToken2,
  decyptToken:         decyptToken,
  decyptToken2:        decyptToken2,
  verifyUniqueCreator: verifyUniqueCreator
}
