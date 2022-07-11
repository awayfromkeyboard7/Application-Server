const http = require("http");
const express = require('express')
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require('./lib/db');
const app = express();

const SocketIO = require("socket.io");
const server = http.createServer(app);
const io = SocketIO(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"]
  }
});

const PORTNUM = 3001;

// https://m.blog.naver.com/psj9102/221282415870
db.connect();
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(express.json());
app.use('/', require('./routes/'));

io.on("connection", socket => {
  console.log(`user connected: ${socket.id}`)
  
  socket.on('message', data => {
    console.log('socket >> message ', data);
  })


  socket.on('result', data => {
    console.log('socket >> result ', data);
    socket.broadcast.emit('receive_result', { userId: data.userId, success: data.success });
  })


  socket.on('problem', data => {
    console.log('socket >> problem ', data);
    socket.emit('receive_problem', { title: '2. 일루미네이션', content: `부유한 집안의 상속자 상근이네 집은 그림과 같이 1미터의 정육각형이 붙어있는 상태이다. 크리스마스가 다가오기 때문에, 여자친구에게 잘 보이기 위해 상근이는 건물의 벽면을 조명으로 장식하려고 한다. 외부에 보이지 않는 부분에 조명을 장식하는 것은 낭비라고 생각했기 때문에, 밖에서 보이는 부분만 장식하려고 한다.`, timeLimit: 300 });
  })

  socket.on('disconnect', () => {
    console.log('disconnected');
  })
});

server.listen(PORTNUM, () => {
  console.log(`Server is running... port: ${PORTNUM}`)
})