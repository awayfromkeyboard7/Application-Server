const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ExampleSchema = new Schema({
  inputText: {
    type: String,
    required: true,
  },
  outputText: {
    type: String,
    required: true,
  },
});

const ProblemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  inputText: {
    type: String,
    required: true,
  },
  outputText: {
    type: String,
    required: true,
  },
  examples: {
    type: [ExampleSchema],
    required: true,
  },
});

// https://getridbug.com/node-js/random-document-from-a-collection-in-mongoose/

ProblemSchema.statics.random = async function () {
  const count = await this.count();
  const rand = Math.floor(Math.random() * count);
  const randomDoc = await this.findOne().skip(rand);
  return randomDoc;
};

ProblemSchema.statics.getProblem = async function (problemId) {
  return await this.findById(problemId).exec();
}

module.exports = mongoose.model("Problem", ProblemSchema);
