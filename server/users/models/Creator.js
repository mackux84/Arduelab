'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const creatorModel = new Schema({
  identification: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },
  cellphone: {
    type: String,
    required: true
  }
},
  {
    timestamps: {
      createdAt: 'created_At',
      updatedAt: 'updated_At'
    }
  }
)

module.exports = mongoose.model('Creator', creatorModel)
