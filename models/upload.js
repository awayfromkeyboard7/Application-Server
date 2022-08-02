const AWS = require("aws-sdk");

require("dotenv").config();

const ID = process.env.s3Id;
const SECRET = process.env.s3Secret;
const BUCKET = process.env.s3Bucket;

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET
});

const uploadFile = async (payload) => {
  const fileType = payload['language'] === 'JavaScript' ? 'js' : 'py';
  const fileName = `${payload['gameLogId']}_${payload['gitId']}.${fileType}`;
  const code = payload['code'];

  const params = {
    Bucket: BUCKET,
    Key: fileName,
    Body: code
  };

  const data = await s3.upload(params).promise();

  return fileName;
}

module.exports = {
  uploadFile
};