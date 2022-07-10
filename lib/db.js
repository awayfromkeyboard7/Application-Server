const mongoose = require("mongoose");
const HOST = process.env.MONGODB_HOST;
const USERNAME = process.env.MONGODB_USERNAME;
const PASSWORD = process.env.MONGODB_PASSWORD;
const DB = process.env.MONGODB_DB;
require("dotenv").config();

const connect = async () => {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: DB,
  };

  try {
    await mongoose.connect(
      `mongodb://${USERNAME}:${PASSWORD}@${HOST}`,
      options
    );
    console.log("[MONGODB] connection success");
  } catch (err) {
    console.log("[MONGODB] connection fail: ", err.message);
    setTimeout(() => {
      connect();
    }, 1000);
  }
};

module.exports = {
  connect,
};
