module.exports = function (io) {
  //conectarea in privat
  io.on('connection', (socket) => {
    socket.on('join PM', (pm) => {
      socket.join(pm.room1);
      socket.join(pm.room2);
    });
    //ascultarea evenimentului pm server side si trimiterea mesajului
    socket.on('private message', (message, callback) => {
      io.to(message.room).emit('new message', {
        text: message.text,
        sender: message.sender
      });

      io.emit('message display', {});
      callback();
    });

    socket.on('refresh', function () {
      io.emit('new refresh', {});
    });
  });
};
