$(document).ready(function () {
  var socket = io();

  var paramOne = $.deparam(window.location.pathname);

  //split ultima parte din url pentru a putea fi folosit pentru participantii chat-ului privat
  var newParam = paramOne.split('.');


  //plasare receiver name in pagina de private chat
  var username = newParam[0];

  $('#receiver_name').text('Chat with @' + username.replace(/-/g, " "));
  //inlocuirea in url
  swap(newParam, 0, 1);
  var paramTwo = newParam[0] + '.' + newParam[1];


  const myVideo = document.createElement('video');
  myVideo.muted = true;

  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream => {
    addVideoStream(myVideo, stream);


  })


  socket.on('connect', function () {
    var params = {
      room1: paramOne,
      room2: paramTwo
    };

    //emiterea unui nou eveniment pentru mesajul privat
    socket.emit('join PM', params);

    socket.on('message display', function () {
      $('#reload').load(location.href + ' #reload');
    });

    //ascultarea evenimentului de refresh din home
    socket.on('new refresh', function () {
      $('#reload').load(location.href + ' #reload');
    });
  });

  //ascultarea evenimentului new message
  socket.on('new message', function (data) {
    var template = $('#message-template').html();
    var message = Mustache.render(template, {
      text: data.text,
      sender: data.sender
    });

    $('#messages').append(message);
  });

  //evenmentul de submit
  $('#message_form').on('submit', function (e) {
    e.preventDefault();
    var msg = $('#msg').val();
    var sender = $('#name-user').val();

    //emitere nou mesaj partea client
    if (msg.trim().length > 0) {
      socket.emit(
        'private message',
        {
          text: msg,
          sender: sender,
          room: paramOne
        },
        function () {
          $('#msg').val('');
        }
      );
    }
  });

  //trimiterea private chat catre baza de date
  $('#send-message').on('click', function () {
    var message = $('#msg').val();
    $.ajax({
      url: '/chat/' + paramOne,
      type: 'POST',
      data: {
        message: message
      },
      success: function () {
        $('#msg').val('');
      }
    });
  });
});

//crearea functiei de inversare
function swap(input, value_1, value_2) {
  var temp = input[value_1];
  input[value_1] = input[value_2];
  input[value_2] = temp;
}


//adaugarea video stream

function addVideoStream(video, stream) {
  const videoGrid = document.getElementById('video-grid');
  video.srcObject = stream;
  video.addEventListener('loadedmetadata', () => {
    video.play();
  });
  videoGrid.append(video);
}