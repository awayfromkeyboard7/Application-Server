const mongoose = require("mongoose");
// https://www.npmjs.com/package/mongoose-random
// const Schema = mongoose.Schema;
// 원본

// https://getridbug.com/node-js/random-document-from-a-collection-in-mongoose/

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

// ProblemSchema.statics.findAll = function () {
//   return this.find().exec();
// };

ProblemSchema.statics.random = async function () {
  const count = await this.count();
  const rand = Math.floor(Math.random() * count);
  const randomDoc = await this.findOne().skip(rand);
  return randomDoc;
};

module.exports = mongoose.model("Problem", ProblemSchema);
