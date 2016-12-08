'use strict'

const Boom        = require('boom')
const createToken = require('../util/userFunctions').createToken
const Common      = require('../util/common')
const User        = require('../models/User')

module.exports = function (request, reply) {
  const id = request.params.id
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
      reply({message: 'User updated!'})
      if (request.payload.email) {
        // send verification email to the new email if the email was updated
        var tokenData = {
          email: user.email,
          university: user.university,
          scope: [user.scope],
          id: user._id
        }
        Common.sentMailVerificationLink(user, createToken(tokenData))
      }
     
    })
}