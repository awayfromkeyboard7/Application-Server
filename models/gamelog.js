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
    // required: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    // required: true,
    ref: 'Problem'
  },
  userHistory: {
    type: [UserHistorySchema],
    // required: true
  },
  code: {
    type: String
  }
});

GameLogSchema.statics.findAll = function() {
  console.log(1);
  return this.find().exec();
};

GameLogSchema.statics.createLog = function(data) {
  return this.create(data);
}

GameLogSchema.statics.updateLog = function(find_field, find_field_name, update_field, update_field_name) {
  console.log('2');
  return this.findOneAndUpdate({ code : find_field_name },{code : update_field_name});
};

module.exports = mongoose.model('GameLog', GameLogSchema);