const http = require("http");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const db = require("./lib/db");
const app = express();
const User = require("./models/user");
const GameLog = require("./models/gamelog");
const GameRoom = require("./models/gameroom")

const SocketIO = require("socket.io");
const server = http.createServer(app);
const io = SocketIO(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});
const SocketRoutes = require("./socketRoutes");

const PORTNUM = 3000;

// https://m.blog.naver.com/psj9102/221282415870
db.connect();
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use("/", require("./routes/"));

io.on("connection", (socket) => {
  console.log(`user connected: ${socket.id}`);

  SocketRoutes.waitGame(socket, SocketRoutes.event.waitGame);
  SocketRoutes.startGame(socket, SocketRoutes.event.startGame);
  SocketRoutes.submitCode(socket, SocketRoutes.event.submitCode);
  SocketRoutes.getRanking(socket, SocketRoutes.event.getRanking);
  SocketRoutes.exitWait(socket, SocketRoutes.event.exitWait);

  // socket.on("disconnecting", () => {
  //   console.log("user disconnecting");
  // });
});

server.listen(PORTNUM, () => {
  console.log(`Server is running... port: ${PORTNUM}`);
});