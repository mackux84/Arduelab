'use strict'

const nodemailer = require('nodemailer')
//const mg = require('nodemailer-mailgun-transport')
const auth = require('../../config/auth')
const crypto = require('crypto')
const algorithm = 'aes-256-ctr'
const privateKey = auth.key.privateKey

/*const mgauth = {
  auth: {
    api_key: auth.mailgun.api_key,
    domain: auth.mailgun.domain
  }
}*/
//const nodemailerMailgun = nodemailer.createTransport(mg(mgauth))
const nodemailerMailgun = nodemailer.createTransport(auth.email.smtp)
exports.decrypt = function (password) {
  return decrypt(password)
}

exports.encrypt = function (password) {
  return encrypt(password)
}

exports.sentMailVerificationLink = function (user, token, callback) {
  const from = auth.email.accountName + ' Team<' + auth.email.username + '>'
  const mailbody = '<p>Thanks for Registering on ' + auth.email.accountName + ' </p><p>Please verify your email by clicking on the verification link below.<br/><a href="http://' + auth.server.external + ':' + auth.server.port + '/' + auth.email.verifyEmailUrl + '/' + token + '">Verification Link</a></p>'
  mail(from, user.email, 'Account Verification', mailbody, callback)
}

exports.sentMailForgotPassword = function (user, callback) {
  const from = auth.email.accountName + ' Team<' + auth.email.username + '>'
  const mailbody = '<p>Your ' + auth.email.accountName + '  Account Credential</p><p>username : ' + user.email + ' , password : ' + decrypt(user.password) + '</p>'
  mail(from, user.email, 'Account password', mailbody, callback)
}

// method to decrypt data(password)
function decrypt(password) {
  const decipher = crypto.createDecipher(algorithm, privateKey)
  let dec = decipher.update(password, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}

// method to encrypt data(password)
function encrypt(password) {
  const cipher = crypto.createCipher(algorithm, privateKey)
  let crypted = cipher.update(password, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

function mail(from, email, subject, mailbody, callback) {
  const mailOptions = {
    from: from, // sender address
    to: email, // list of receivers
    subject: subject, // Subject line
    // text: result.price, // plaintext body
    html: mailbody // html body
  }
  nodemailerMailgun.sendMail(mailOptions, function (error) {
    if (error) {
      console.error(error)
      // throw error
    } else {
      nodemailerMailgun.close() // shut down the connection pool, no more messages
    }
    callback(error)
  })
}
