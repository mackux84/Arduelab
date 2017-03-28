'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reservesModel = new Schema({
  email: {
    type: String,
    required: true,
  },
  expName: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true
  },
  idExp: {
    type: Schema.Types.ObjectId,
    required: true
  },
  initialDate: {
    type: Date,
    required: true,
    index: true
  },
  duration: {
    type: Number,
    required: true,
  },
  token: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  used: {
    type: Boolean,
    required: true,
    default: false
  },
  enabled: {
    type: Boolean,
    required: true,
    default: true
  },
  scope: {
    type: String,
    enum: ['User', 'Premium', 'Admin'],
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

module.exports = mongoose.model('Reserve', reservesModel)
