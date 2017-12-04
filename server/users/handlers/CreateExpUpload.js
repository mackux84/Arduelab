'use strict'

const Boom = require('boom')
const Experiment = require('../models/Experiment')
var fs = require('fs')

module.exports = function (request, reply) {
  if (request.payload) {
    var data = request.payload
    if (data.image) {
      var name = data.image.hapi.filename
      var path = __dirname + '/../../../uploads/image/' + name
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
            filename: data.image.hapi.filename,
            headers: data.image.hapi.headers
          }
          console.log('image uploaded: ' + ret.filename)
          // console.log('string: '+data.teststr)
          // reply(JSON.stringify(ret))
          if (data.pdf) {
            var name2 = data.pdf.hapi.filename
            var path2 = __dirname + '/../../../uploads/pdf/' + name2
            var file2 = fs.createWriteStream(path2)

            file2.on('error', function (err) {
              console.error(err)
              reply(Boom.badRequest('error'))
            })

            file2.on('close', function (err) {
              if (err) {
                console.error(err)
                reply(Boom.badRequest('error'))
              } else {
                var ret2 = {
                  filename: data.pdf.hapi.filename,
                  headers: data.pdf.hapi.headers
                }
                console.log('File uploaded: ' + ret2.filename)
                // console.log('string: '+data.teststr)
                // reply(JSON.stringify(ret))
                let experiment = new Experiment()
                experiment.name = request.payload.name
                experiment.university = request.payload.university
                experiment.city = request.payload.city
                experiment.country = request.payload.country
                experiment.idCreator = request.payload.idCreator
                experiment.docCreator = request.payload.docCreator
                experiment.arduino = request.payload.arduino
                experiment.url = request.payload.url
                experiment.days = request.payload.days
                experiment.schedule = request.payload.schedule
                experiment.schedule[2]=request.payload.schedule2[0]
                experiment.schedule[3]=request.payload.schedule2[1]
                experiment.duration = request.payload.duration
                experiment.enabled = request.payload.enabled
                experiment.adminEnabled = false
                experiment.description = request.payload.description
                experiment.image = data.image.hapi.filename
                experiment.pdf = data.pdf.hapi.filename

                experiment.save((error, experiment) => {
                  if (!error) {
                    var exec = require('child_process').exec
                    exec('echo "CREACION DE EXPERIMENTO CON NOMBRE     '+experiment.name+'\n\nFAVOR VERIFICAR EN LA CONSOLA DE ADMINISTRACION EL EXPERIMENTO CREADO" | mail -s "CREACION DE NUEVO EXPERIMENTO, FAVOR VERIFICAR EN LA PLATAFORMA" arduinserver@gmail.com')
                    exec('echo "FELICIDADES POR LA CREACION DE TU PRIMER EXPERIMENTO, ACA ENCONTRARAS EL MANUAL CON LOS PASOS A SEGUIR, COMO LA APLICACION QUE DEBERAS DESCARGAR PARA LLEVAR A CABO EL PROCESO DE VINCULACION.\n\nMANUAL:  https://drive.google.com/file/d/1kYDqplX3FZYUT2J_pJ0yCOejt3H0sgcq/view?usp=sharing\nAPPLIANCE:  https://drive.google.com/file/d/1xQWtJCw6S0JZPj77zqzO5OqQLBu87kZE/view?usp=sharing \n\n\n ARDUELAB TEAM" | mail -s "CREACION DE NUEVO EXPERIMENTO, FAVOR SEGUIR INDICACIONES" '+experiment.idCreator)
                    reply({ message: 'EXPERIMENTO CREADO CORRECTAMENTE' })
                    var path1 = __dirname + '/../../../uploads/pdf/' + experiment.pdf
                    var path2 = __dirname + '/../../../uploads/pdf/' + experiment._id + '.pdf'
                    fs.rename(path1, path2, function (err) {
                      if (err) {
                        console.log(err)
                      } else {
                        console.log('Renamed ' + path1 + ' to ' + path2)
                        var path3 = __dirname + '/../../../uploads/image/' + experiment.image
                        var path4 = __dirname + '/../../../uploads/image/' + experiment._id + '.jpg'
                        fs.rename(path3, path4, function (err) {
                          if (err) {
                            console.log(err)
                          } else {
                            console.log('Renamed ' + path3 + ' to ' + path4)
                          }
                        })
                      }
                    })

                  } else {
                    console.log(error)
                    reply(Boom.forbidden(error))
                  }
                })
              }
            })
            data.pdf.pipe(file2)
          }
        }
      })
      data.image.pipe(file)
    }
  } else {
    reply(Boom.badRequest('error'))
    return
  }
}