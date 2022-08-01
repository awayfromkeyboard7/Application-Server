socket.on("exitWait", async (gitId) => {
    console.log("exitWait roomId >>>>>>>>>>>>>> ", socket.bangjang);
    let myRoom = await GameRoom.getRoom(socket);
    console.log("exitWait roomId >>>>>>>>>>>>>> ", myRoom);

    // GameRoom.setRoom(GameRoom.room[GameRoom.getIdx()]?.filter((item) => item.gitId !== gitId));
    try {
      // 팀전에서 방장이 exitWait call
      if (gitId in teamRoom) {
        socket.nsp.to(teamRoom[gitId].id).emit("exitTeamGame", gitId);
        delete teamRoom[gitId]
      } 
      else {
        // 팀전에서 팀원이 exitWait call
        if (socket.bangjang !== undefined) {
          teamRoom[socket.bangjang].players = teamRoom[socket.bangjang].players.filter(player => {
            return player.userInfo.gitId !== gitId
          })
          socket.to(teamRoom[socket.bangjang].id).emit("enterNewUserToTeam", getPlayers(teamRoom[socket.bangjang]))
          socket.bangjang = undefined
        } 
        // 개인전에서 exitWait call
        else {
          console.log("SOLO EXIT>>>>>>>>", GameRoom.room , socket.rooms);
          GameRoom.deleteUser(socket, gitId);
          console.log("SOLO EXIT AFTER>>>>>>>>", GameRoom.room);
          console.log("PLAYERS AFTER EXIT", GameRoom.room)
          if (GameRoom.room[myRoom[4]] !== undefined) {
            socket.to(myRoom).emit("exitWait", GameRoom.room[myRoom[4]].players);
          } else {
            console.log("HERE DELETE INTERVAL at WAITGAME");
            Interval.deleteInterval(`room${idx}`,'wait');
            // let timeLimit = new Date();
            // timeLimit.setMinutes(timeLimit.getMinutes() + 3);
            // Interval.makeInterval(socket,`room${idx}`,timeLimit,"wait")
          }
        }
      }
      // 모든방에서 나가진 후 자기 private room 입장
      socket.leave(myRoom);
    } catch(e) {
      console.log(`exitWait ERROR ::::::: gitId: ${gitId}`);
      console.log(`exitWait ERROR ::::::: log: ${e}`);
    }
  });

  socket.on("getRoomId", async () => {
    try {
      const myRoom = GameRoom.getRoom(socket);
      console.log('BEFORE', myRoom, socket.rooms, GameRoom.room[myRoom[4]]);
      if (GameRoom.room[myRoom[4]].status === 'waiting') {
        socket.emit('getRoomId', myRoom, 'waiting');
        GameRoom.setStatus(myRoom[4], 'playing');
        console.log('AFTER', GameRoom.room[myRoom[4]]);
      }
    } catch (e) {
      console.log(e)
    }
  })