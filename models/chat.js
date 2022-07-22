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
}

function sendChat(sender, receiver, message) {
  try {
    if (chatLogs[sender][receiver] === undefined) {
      chatLogs[sender][receiver] = { message: [message], unread: 1 };
    } else {
      chatLogs[sender][receiver].message.push(message);
      chatLogs[sender][receiver].unread += 1;
    }
    // socket.to(UserSocket.getSocketId(receiver)).emit('sendChatMessage', message);

    console.log(`Send Chat ${sender} >>> ${receiver}`, chatLogs[sender]);
  } catch (e) {
    console.log('/models/chat.js sendChat ERROR :::: ', sender, receiver, message)
    console.log('/models/chat.js sendChat ERROR :::: ', e)
  }
}

function receiveChat(sender, receiver) {
  try {
    const senderToReceiver = chatLogs[sender][receiver] !== undefined ? chatLogs[sender][receiver].message : [];
    const receiverToSender = chatLogs[receiver][sender] !== undefined ? chatLogs[receiver][sender].message : [];

    // 읽지 않은 메시지 리셋
    chatLogs[receiver][sender].unread = 0;

    let myChatLogs = senderToReceiver.concat(receiverToSender);
    myChatLogs.sort((a, b) => a.sendAt - b.sendAt);

    if (myChatLogs.length > 60) {
     myChatLogs = myChatLogs.slice(-60);
     chatLogs[sender][receiver].message =  JSON.parse(JSON.stringify((chatLogs[sender][receiver].message.filter(message => { return message["senderId"] === sender }))));
     chatLogs[receiver][sender].message =  JSON.parse(JSON.stringify((chatLogs[receiver][sender].message.filter(message => { return message["senderId"] === receiver }))));
    }

    return myChatLogs;
  } catch(e) {
    console.log("getChatMessage ERROR >>>>>>> ", sender, receiver);
    return false;
  }
}

async function getUnreadCount(sender, receiver) {
  try {
    console.log("getUnreadCount :::: ", sender, receiver);
    if (chatLogs[sender][receiver] !== undefined) {
      console.log("getUnreadCount :::: receiver unread ", chatLogs[sender][receiver].unread);
      return chatLogs[sender][receiver].unread;
    }
  } catch (e) {
    console.log("getUnreadCount ERROR >>>>>>> ", sender, receiver);
    console.log("getUnreadCount ERROR >>>>>>> ", e);
  }
}

function resetUnreadCount(sender, receiver) {
  try {
    chatLogs[sender][receiver].unread = 0;
  } catch(e) {
    console.log("resetUnreadCount ERROR >>>>>>> ", sender, receiver);
  }
}

module.exports = {
  isExist,
  setChatLog,
  sendChat,
  receiveChat,
  getUnreadCount,
  resetUnreadCount
}