const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserHistorySchema = new Schema({
  gitId: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default : ''
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
    default: 0
  },
  passRate: {
    type: Number,
    default: 0
  }
});

const GameLogSchema = new Schema({
  startAt: {
    type: Date,
    default : Date.now
    // required: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    // required: true,
    default : '',
    ref: 'Problem'
  },
  userHistory: {
    type: [UserHistorySchema],
    // required: true
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