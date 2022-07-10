const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/* userHistory: Array of attributes updated after game closed */
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
    default: '0'
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
    required: true
  },
  problemId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Problem',
  },
  userHistory: {
    type: [UserHistorySchema],
    required: true
  },
});

GameLogSchema.statics.createLog = function(data) {
  return this.create(data);
}

GameLogSchema.statics.updateLog = function(data) {
  if (data['submitAt'] == null) {
    date = Date.now();
  } else {
    date = new Date(data['submitAt'])
  }
  console.log(date);
  return this.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(data['gameId']) },
    { 
      $set: { 
        'userHistory.$[element].language': data['language'],
        'userHistory.$[element].code': data['code'],
        'userHistory.$[element].submitAt': date,
        'userHistory.$[element].ranking': data['ranking'],
        'userHistory.$[element].passRate': data['passRate']
      }
    },
    { 
      arrayFilters: [{ 'element.gitId': data['gitId'] }],
      new: true
    }
  )
};

module.exports = mongoose.model('GameLog', GameLogSchema);