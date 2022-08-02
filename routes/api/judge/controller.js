require("dotenv").config();
const AWS = require("aws-sdk");
const fetch = require("node-fetch");
const Auth = require("../../../models/auth");
const s3 = require("../../../models/upload");

async function sendCode(req, res) {
  // judge 도커에 채점 요청
  console.log("JudgeServer :::: start");
  const gitId = req.body["gitId"];
  const problemId = req.body["problemId"];
  const lang = req.body["language"];
  const code = req.body["code"];

  console.log("Send request to JudgeServer");

  try {
    const response = await fetch(`${process.env.JUDGE_SERVER_URL}/judge`, {
      method: "post",
      body: JSON.stringify({
        gitId,
        problemId,
        lang,
        code,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    console.log("Accept result from JudgeServer");
    console.log("Send result to Client");
    res.status(200).json(data);
  } catch (error) {
    console.log(`[ERROR]/judge/${error.name}/${error.message}`);
    res.status(409);
  }
}

const ID = process.env.s3Id;
const SECRET = process.env.s3Secret;

const judgeJS = process.env.lambdaJS;
const judgePY = process.env.lambdaPY;

const lambda = new AWS.Lambda({
  accessKeyId: ID,
  secretAccessKey: SECRET,
  region: "ap-northeast-2",
});

exports.judgeLambda = async function (req, res) {
  const payload = await Auth.verify(req.cookies["jwt"]);
  try {
    if (payload.gitId === req.body.gitId) {
      console.log("lambda :::: start");

      let fileName = "";
      let body;

      if (req.body["submit"] === true) {
        fileName = await s3.uploadFile(req.body);
        body = {
          submit: true,
          fileName: fileName,
          problemId: req.body["problemId"],
        };
      } else {
        body = {
          submit: false,
          code: req.body["code"],
          fileName: `${req.body["gameLogId"]}_${req.body["gitId"]}`,
          problemId: req.body["problemId"],
        };
      }

      const judgeFunction =
        req.body["language"] === "JavaScript" ? judgeJS : judgePY;

      const params = {
        FunctionName: judgeFunction,
        Payload: JSON.stringify(body),
      };

      const data = await lambda.invoke(params).promise();
      const returnValue = JSON.parse(JSON.parse(data["Payload"])["body"]);
      console.log("Send result to Client");
      res.status(200).json(returnValue);
    } else {
      res.status(403).json({
        success: false,
        message: "Invalid JWT Token",
      });
    }
  } catch (error) {
    console.log("[ERROR][judgeLambda] resend request to JudgeServer");
    await sendCode(req, res);
  }
};
