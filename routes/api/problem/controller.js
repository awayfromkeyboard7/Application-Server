const request = require("superagent");
const Problem = require("../../../models/db/problem");

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

// exports.getProblem = async (req, res) => {
//   console.log("hello");
// };
