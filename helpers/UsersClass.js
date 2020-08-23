class Users {
  constructor() {
    this.users = [];
  }

  //functie adaugare user in array users
  AddUserData(id, name, room) {
    var users = { id, name, room };
    this.users.push(users);
    return users;
  }

  //un singur utilizator
  GetUser(id) {
    var getUser = this.users.filter((userId) => {
      return userId.id === id;
    })[0];

    return getUser;
  }

  //eliminare utilizator din array cand se deconecteaza din sala
  RemoveUser(id) {
    var user = this.GetUser(id);
    if (user) {
      this.users = this.users.filter((user) => user.id !== id);
    }
    return user;
  }

  //functie afisare utilizatori din sala
  GetUsersList(room) {
    var users = this.users.filter((user) => user.room === room);
    var namesArray = users.map((user) => {
      return user.name;
    });
    return namesArray;
  }
}

module.exports = { Users };
