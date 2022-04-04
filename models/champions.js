const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const championsSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  place: {
    type: Number,
  }
})

module.exports = mongoose.model('Champions', championsSchema)