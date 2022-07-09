const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExampleSchema = new Schema({
  inputText: {
    type: String,
    required: true
  },
  outputText: {
    type: String,
    required: true
  }
})

const ProblemSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  inputText: {
    type: String,
    required: true
  },
  outputText: {
    type: String,
    required: true
  },
  examples: {
    type: [ExampleSchema],
    required: true
  }
});

ProblemSchema.statics.findAll = function() {
  return this.find().exec();
};

module.exports = mongoose.model('Problem', ProblemSchema);