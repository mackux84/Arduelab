'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userModel = new Schema({
  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  identification: {
    type: String,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  university: {
    type: String,
  },
  telephone: {
    type: String,
  },
  cellphone: {
    type: String,
  },
  scope: {
    type: String,
    enum: ['User', 'Premium','Creator', 'Admin'],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: {
      createdAt: 'created_At',
      updatedAt: 'updated_At'
    }
  }
)

module.exports = mongoose.model('User', userModel)
