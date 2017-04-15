'use strict'

const Boom = require('boom')
var fs = require('fs')

module.exports = function (request, reply) {
  if (request.payload) {
    var data = request.payload
    if (data.pdf) {
      var name = data.pdf.hapi.filename
      var path = __dirname + '/../../../uploads/' + name
      var file = fs.createWriteStream(path)

      file.on('error', function (err) {
        console.error(err)
        reply(Boom.badRequest('error'))
      })

      file.on('close', function (err) {
        if (err) {
          console.error(err)
          reply(Boom.badRequest('error'))
        } else {
          var ret = {
            filename: data.pdf.hapi.filename,
            headers: data.pdf.hapi.headers
          }
          console.log('File uploaded: ' + ret.filename)
          reply(JSON.stringify(ret))
        }
      })
      data.pdf.pipe(file)

      data.pdf.on('end', function (err) {
        if (err) {
          reply(Boom.badRequest('error'))
          return
        } else {
          /*var ret = {
            filename: data.pdf.hapi.filename,
            headers: data.pdf.hapi.headers
          }
          console.log('file uploaded to:')
          console.log(path)
          reply(JSON.stringify(ret))
          return*/
        }
      })
    }
  } else {
    reply(Boom.badRequest('error'))
    return
  }
}