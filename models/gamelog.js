const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserHistorySchema = new Schema({
  gitId: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true
  },
  code: {
    type: String,
    default: ''
  },
  submitAt: {
    type: Date,
    default: Date.now
  },
  ranking: {
    type: Number,
    required: true
  },
  passRate: {
    type: Number,
    required: true
  }
});

const GameLogSchema = new Schema({
  startAt: {
    type: Date,
    required: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Problem'
  },
  userHistory: {
    type: [UserHistorySchema],
    required: true
  }
});

GameLogSchema.statics.findAll = function() {
  return this.find().exec();
};

module.exports = mongoose.model('GameLog', GameLogSchema);