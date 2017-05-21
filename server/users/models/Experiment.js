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
  city: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },  
  idCreator: {
    type: Schema.Types.ObjectId,
    required: true
  },
  docCreator: {
    type: String,
    required: true
  },
  arduino: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  pdf: {
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
  adminEnabled: {
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