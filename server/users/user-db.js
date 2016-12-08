var Mongoose = require('mongoose')
var config = require('../config/auth.js').user_db
Mongoose.Promise = require('bluebird')

Mongoose.connect('mongodb://' + config.host + '/' + config.db)
var db = Mongoose.connection
db.on('error', console.error.bind(console, 'Connection with user database error'))

db.once('open', function callback () {
  console.log('Connection with user database succeeded.')
})

exports.Mongoose = Mongoose
exports.db = db
