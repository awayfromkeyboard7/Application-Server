const UserSocket = require("./usersocket");

let chatLogs = {};

function isExist(gitId) {
  if (gitId in chatLogs) {
    return true;
  } else {
    return false;
  }
}

function setChatLog(gitId, logs) {
  chatLogs[gitId] = logs
  console.log("setChatLog ::::: ", chatLogs);
}

function sendChat(sender, receiver, message) {
  try {
    if (chatLogs[sender][receiver] === undefined) {
      chatLogs[sender][receiver] = [message];
    } else {
      chatLogs[sender][receiver].push(message);
    }
    // socket.to(UserSocket.getSocketId(receiver)).emit('sendChatMessage', message);
    console.log(chatLogs[sender]);
  } catch (e) {
    console.log('/models/chat.js sendChat ERROR :::: ', sender, receiver, message)
    console.log('/models/chat.js sendChat ERROR :::: ', e)
  }
}

function receiveChat(sender, receiver) {
  try {
    const senderToReceiver = chatLogs[sender][receiver] !== undefined ? chatLogs[sender][receiver] : [];
    const receverToSender = chatLogs[receiver][sender] !== undefined ? chatLogs[receiver][sender] : [];

    let myChatLogs = senderToReceiver.concat(receverToSender);
    myChatLogs.sort((a, b) => a.sendAt - b.sendAt);
    console.log('myChatLogs::::::::::');
    if (myChatLogs.length > 60) {
     myChatLogs = myChatLogs.slice(-60);
     chatLogs[sender][receiver] =  JSON.parse(JSON.stringify((chatLogs[sender][receiver].filter(message => { return message["senderId"] === sender }))));
     chatLogs[receiver][sender] =  JSON.parse(JSON.stringify((chatLogs[receiver][sender].filter(message => { return message["senderId"] === receiver }))));
    }
    return myChatLogs;
  } catch(e) {
    console.log("getChatMessage ERROR >>>>>>> ", sender, receiver);
    console.log("getChatMessage ERROR >>>>>>> ", e);
    return false;
  }
}

module.exports = {
  isExist,
  setChatLog,
  sendChat,
  receiveChat
}