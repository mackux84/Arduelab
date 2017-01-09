'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const experimentsModel = new Schema({
  name: {
    type: String,
    required: true
  },
  university: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  days: {
    type: [Number],
    required: true
  },
  schedule: {
    type: [Number],
    required: true
  },
  duration: {
    type: [Number],
    required: true
  },
  enabled: {
    type: Boolean,
    required: true
  },
  description: {
    type: String
  }
},
  {
    timestamps: {
      createdAt: 'created_At',
      updatedAt: 'updated_At'
    }
  }
)

module.exports = mongoose.model('Experiment', experimentsModel)