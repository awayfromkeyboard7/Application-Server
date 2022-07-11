module.exports = (socket, event) => {
  socket.on(event, (message) => {
    console.log('socket >> message ', message);
  })
}