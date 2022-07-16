const request = require("superagent");
const Problem = require("../../../models/problem");

// exports.getProblem = async (req, res) => {
//   try {
//     const problems = await Problem.findAll();

//     res.status(200).json({
//       problems,
//       success: true,
//     });
//   } catch (err) {
//     res.status(409).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

exports.getProblem = async (req, res) => {
  try {
    const problems = await Problem.random();

    res.status(200).json({
      problems,
      success: true,
    });
  } catch (err) {
    res.status(409).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createProblem = async (req, res) => {
  try {
    const postProblem = {
      title: req.body.title,
      content: req.body.content,
      inputText: req.body.inputText,
      outputText: req.body.outputText,
      examples: req.body.examples,
    };

    const cretePr = await Problem.createPr(postProblem);

    res.status(200).json({
      createPr: cretePr._id,
      success: true,
    });
  } catch (err) {
    res.status(409).json({
      success: false,
      message: err.message,
    });
  }
};

// exports.getProblem = async (req, res) => {
//   console.log("hello");
// };
