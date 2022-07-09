const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RankingSchema = new Schema({
  token: {
    type: String,
    required: true
  },
  gitId: {
    type: String,
    required: true
  },
  nodeId: {
    type: Number,
    required: true
  },
  imgUrl: {
    type: String,
  },
  totalScore: {
    type: Number,
    default: 0
  },
  problemHistory: {
    type: Array,
    default: []
  },
  gameHistory: {
    type: Array,
    default: []
  }
});

RankingSchema.statics.findAll = function() {
  return this.find().exec();
};

module.exports = mongoose.model('Ranking', RankingSchema);