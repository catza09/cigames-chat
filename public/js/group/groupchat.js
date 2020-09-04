$(document).ready(function () {
  var socket = io();
  var room = $('#groupName').val();
  var sender = $('#sender').val();
  var userPic = $('#name-image').val();
  const chatArea = document.querySelector('.chat_area');
  socket.on('connect', function () {
    // console.log('yeah user connect');
    //sala unde se conecteaza din adresa
    var params = {
      room: room,
      name: sender
    };

    //emiterea doar catre userii conectati in acea sala
    socket.emit('join', params, function () {
      //console.log('User has joined this channel');
    });
  });

  //ascultarea evenimentului userList pentru afisarea utilizatorilor din acea sala
  socket.on('usersList', function (users) {
    // console.log(users);
    var ol = $('<ol></ol>');
    for (var i = 0; i < users.length; i++) {
      ol.append(
        '<p><a id="val" data-toggle="modal" data-target="#myModal">' +
        users[i] +
        '</a></p>'
      );
    }
    //click event pe modal sa afiseze userul din lista si sa atribuie inputului ascuns receivername
    $(document).on('click', '#val', function () {
      $('#name').text('@' + $(this).text());
      $('#receiverName').val($(this).text());
      //adaugarea link-ului catre profil din modal
      $('#nameLink').attr("href", "/profile/" + $(this).text());
    });

    $('#numValue').text(users.length + ' ');
    $('#users').html(ol);
  });

  //asculatrea evenimentului newMessage de la server,
  // randarea  folosind Mustache si adaugarea mesajului in grup

  socket.on('newMessage', function (data) {
    var template = $('#message-template').html();
    var message = Mustache.render(template, {
      text: data.text,
      sender: data.sender,
      userImage: data.image
    });

    $('#messages').append(message);
    chatArea.scrollTop = chatArea.scrollHeight;
  });

  $('#message-form').on('submit', function (e) {
    e.preventDefault();

    var msg = $('#msg').val();
    chatArea.scrollTop = chatArea.scrollHeight;
    //emitere nou mesaj partea client
    socket.emit(
      'createMessage',
      {
        text: msg,
        room: room,
        sender: sender,
        userPic: userPic
      },

      //golirea campului text dupa trimiterea mesajului
      function () {
        $('#msg').val('');
        $('#msg').focus();
      }
    );

    //trimiterea mesajelor din chat catre baza de date
    $.ajax({
      url: '/group/' + room,
      type: 'POST',
      data: {
        message: msg,
        groupName: room
      },
      success: function () {
        chatArea.scrollTop = chatArea.scrollHeight;
        $('#msg').val('');
        $('#msg').focus();
      }
    })
  });
});
