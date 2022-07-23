import request from "superagent";
import { random } from "../../../models/db/problem";

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

export async function getProblem(req, res) {
  try {
    const problems = await random();

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
}

// exports.getProblem = async (req, res) => {
//   console.log("hello");
// };
