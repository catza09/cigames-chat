module.exports = function (io, Global, _) {
  const players = new Global();

  io.on('connection', (socket) => {
    //ascultarea evenimentului globalroom si crearea unui array pentru toti utilizatorii conectati
    socket.on('global room', (global) => {
      socket.join(global.room);

      players.EnterRoom(socket.id, global.name, global.room, global.img);
      const nameProp = players.GetRoomList(global.room);
      //eliminarea duplicatelor din array nameProp
      const arr = _.uniqBy(nameProp, 'name');

      //emiterea unui nou eveniment pentru partea de client
      io.to(global.room).emit('loggedInUser', arr);
    });
    //eliminarea din array-ul de prieteni online
    socket.on('disconnect', () => {
      const user = players.RemoveUser(socket.id);
      if (user) {
        var userData = players.GetRoomList(user.room);
        const arr = _.uniqBy(userData, 'name');
        const removeData = _.remove(arr, { 'name': user.name });
        io.to(user.room).emit('loggedInUser', arr);
      }
    });
  });
};
