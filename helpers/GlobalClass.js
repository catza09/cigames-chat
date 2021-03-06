class Global {
  constructor() {
    this.globalRoom = [];
  }

  //functie adaugare user in array roomName
  EnterRoom(id, name, room, img) {
    var roomName = { id, name, room, img };
    this.globalRoom.push(roomName);
    return roomName;
  }
  //un singur utilizator
  GetUser(id) {
    var getUser = this.globalRoom.filter((userId) => {
      return userId.id === id;
    })[0];

    return getUser;
  }

  //eliminare utilizator din array cand se deconecteaza din sala
  RemoveUser(id) {
    var user = this.GetUser(id);
    if (user) {
      this.users = this.globalRoom.filter((user) => user.id !== id);
    }
    return user;
  }
  //functie afisare utilizatori din sala
  GetRoomList(room) {
    var roomName = this.globalRoom.filter((user) => user.room === room);
    var namesArray = roomName.map((user) => {
      return { name: user.name, img: user.img };
    });
    return namesArray;
  }
}

module.exports = { Global };
