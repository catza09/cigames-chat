module.exports = function (io, Users) {
  //constructor
  const users = new Users();
  io.on('connection', (socket) => {
    // console.log('User Connected');

    //conectarea utilizatorului catre sala server side
    socket.on('join', (params, callback) => {
      socket.join(params.room);
      users.AddUserData(socket.id, params.name, params.room);
      // console.log(params.room);
      io.to(params.room).emit('usersList', users.GetUsersList(params.room));
      // console.log(users.GetUsersList(params.room));
      callback();
    });

    //atrimiterea mesajelor catre toti utilizatorii dintr-o sala
    socket.on('createMessage', (message, callback) => {
      //  console.log(message);
      io.to(message.room).emit('newMessage', {
        text: message.text,
        room: message.room,
        sender: message.sender,
        image: message.userPic,
      });
      callback();
    });

    // eliminarea utilizatorului la deconectare
    socket.on('disconnect', () => {
      var user = users.RemoveUser(socket.id);
      if (user) {
        io.to(user.room).emit('usersList', users.GetUsersList(user.room));
      }
    });
  });
};
