module.exports = function (io) {
  io.on('connection', (socket) => {
    //asculatea  joinrequest event
    socket.on('joinRequest', (myRequest, callback) => {
      socket.join(myRequest.sender);
      callback();
    });

    //ascultarea evenimentului friendRequst si emiterea unui nou eveniment newFriendRequest pentru afisarea in timp real
    socket.on('friendRequest', (friend, callback) => {
      io.to(friend.receiver).emit('newFriendRequest', {
        from: friend.sender,
        to: friend.receiver
      });
      callback();
    });
  });
};
