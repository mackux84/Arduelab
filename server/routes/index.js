const base = require('./base')
const users = require('./users')
const websockets = require('./websockets.js')
const admin = require('./admin.js')

module.exports = [].concat(base,
                           users,
                           websockets,
                           admin
                           )
