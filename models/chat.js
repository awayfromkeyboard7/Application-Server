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
  } catch (e) {
    console.log(`[sendChat][ERROR] :::: sender: ${sender} receiver: ${receiver} message: ${message}`);
    console.log(`[sendChat][ERROR] :::: log: ${e}`);
  }
}

function receiveChat(sender, receiver) {
  try {
    const senderToReceiver = chatLogs[sender][receiver] !== undefined ? chatLogs[sender][receiver].message : [];
    const receiverToSender = chatLogs[receiver][sender] !== undefined ? chatLogs[receiver][sender].message : [];

    // 읽지 않은 메시지 리셋
    if (sender in chatLogs[receiver]) {
      chatLogs[receiver][sender].unread = 0;
    }

    let myChatLogs = senderToReceiver.concat(receiverToSender);
    myChatLogs.sort((a, b) => a.sendAt - b.sendAt);

    if (myChatLogs.length > 60) {
     myChatLogs = myChatLogs.slice(-60);
     chatLogs[sender][receiver].message =  JSON.parse(JSON.stringify((chatLogs[sender][receiver].message.filter(message => { return message["senderId"] === sender }))));
     chatLogs[receiver][sender].message =  JSON.parse(JSON.stringify((chatLogs[receiver][sender].message.filter(message => { return message["senderId"] === receiver }))));
    }

    return myChatLogs;
  } catch(e) {
    console.log(`[getChatMessage][ERROR] :::: sender: ${sender} receiver: ${receiver}`);
    console.log(`[getChatMessage][ERROR] :::: log: ${e}`);
    return false;
  }
}

async function getUnreadCount(sender, receiver) {
  try {
    // console.log("getUnreadCount :::: ", sender, receiver);
    if (chatLogs[sender][receiver] !== undefined) {
      // console.log("getUnreadCount :::: receiver unread ", chatLogs[sender][receiver].unread);
      return chatLogs[sender][receiver]?.unread;
    }
  } catch (e) {
    console.log(`[getUnreadCount][ERROR] :::: sender: ${sender} receiver: ${receiver}`);
    console.log(`[getUnreadCount][ERROR] :::: log: ${e}`);
  }
}

function resetUnreadCount(sender, receiver) {
  try {
    chatLogs[sender][receiver].unread = 0;
  } catch(e) {
    console.log(`[resetUnreadCount][ERROR] :::: sender: ${sender} receiver: ${receiver}`);
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