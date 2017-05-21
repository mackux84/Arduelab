'use strict'

const Boom = require('boom')
const Creator = require('../models/User')

module.exports = function (request, reply) {
  if (request.payload.email !== '') {
    Creator
      .find({ $and: [ {email: request.payload.email}, { scope: 'Creator' } ] })
      // .find({email: request.payload.email})
      // Deselect the password and version fields
      .select('-__v')
      .exec((error, creators) => {
        if (error) {
          reply(Boom.badRequest(error))
          return
        }
        if (!creators.length) {
          reply(Boom.notFound('NO SE ENCONTRARON CREADORES'))
          return
        }
        reply(creators)
      })
  } else {
    Creator
      .find( { scope: 'Creator' })
      // Deselect the password and version fields
      .select('-__v')
      .exec((error, creators) => {
        if (error) {
          reply(Boom.badRequest(error))
          return
        }
        if (!creators.length) {
          reply(Boom.notFound('NO SE ENCONTRARON CREADORES'))
          return
        }
        reply(creators)
      })
  }
}