'use strict'

const Boom      = require('boom')
const User      = require('../models/User')
const Reserve   = require('../models/Reserve')
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
        reply(Boom.badRequest('Email already in use'))
        return
      }
    }
    // If everything checks out, send the payload through
    // to the route handler
    reply(request.payload)
  })
}
function verifyUniqueReserve (request, reply) {
  // Find an entry from the database that matches the email
  var diatemp = request.payload.dia
  if (diatemp<10) {
    diatemp = '0'+diatemp //JS ISO format days must be 2 digits (leading zero)
  }
  var mestemp = parseInt(request.payload.mes) //JS month date starts at 0
  if (mestemp<10) {
    mestemp = '0'+mestemp //JS ISO format month must be 2 digits (leading zero)
  }
  var hourtemp = parseInt(request.payload.hora)+5 //Time Zone, JS date os UTC
  if (hourtemp<10) {
    hourtemp = '0'+hourtemp //JS ISO format hour must be 2 digits (leading zero)
  }
  var temp = {
    dia: diatemp,
    mes: mestemp,
    anio: request.payload.anio,
    hora: hourtemp
  }
  var datestr = temp.anio + '-' + temp.mes + '-' + temp.dia + 'T' + temp.hora + ':00:00'
  //var d = new Date('2015-03-25T12:00:00')
  var date = new Date(datestr)
  Reserve.findOne({
    initialDate: date
  }, (err, reserve) => {
    // Check if the reserve exists
    if (reserve) {
      reply(Boom.badRequest('A reserve for that time already exists'))
      return
    }
    // If everything checks out, send the payload through
    // to the route handler
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
        reply(Boom.forbidden('invalid username or password'))
        return
      }
      if (request.payload.password === Common.decrypt(user.password)) {
        if (!user.isVerified) {
          reply('Your email address is not verified. please verify your email address to proceed')
          return
        }
        reply(user)
      }else {
        reply(Boom.forbidden('invalid username or password'))
      }
    }else {
      if (11000 === err.code || 11001 === err.code) {
        reply(Boom.forbidden('please provide another user email'))
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
  var initial = moment(tokenData.hora + ':' + tokenData.minuto + ':00 '+tokenData.dia+'-'+tokenData.mes+'-'+tokenData.anio, 'HH:mm:ss DD-MM-YYYY').unix()
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
  decyptToken2:        decyptToken2
}
