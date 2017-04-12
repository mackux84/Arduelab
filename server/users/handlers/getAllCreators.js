'use strict'

const Boom = require('boom')
const Creator = require('../models/Creator')

module.exports = function (request, reply) {
  if (request.payload.identification !== '') {
    Creator
      .find({identification: request.payload.identification})
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
      .find()
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