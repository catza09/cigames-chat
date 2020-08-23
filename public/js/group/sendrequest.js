$(document).ready(function () {
  var socket = io();
  var room = $('#groupName').val();
  var sender = $('#sender').val();

  socket.on('connect', function () {
    var params = {
      sender: sender
    };
    socket.emit('joinRequest', params, function () {
      console.log('Joined');
    });
  });

  //actualizare in timp real cererea de prietenie
  socket.on('newFriendRequest', function (friend) {

    $('#reload').load(location.href + ' #reload');
    //acceptarea cererii de prietenie
    $(document).on('click', '#accept_friend', function () {
      var senderId = $('#senderId').val();
      var senderName = $('#senderName').val();

      $.ajax({
        url: '/group/' + room,
        type: 'POST',
        data: { senderId: senderId, senderName: senderName },
        //scoaterea notificarii din dropdown
        success: function () {
          $(this).parent().eq(1).remove();
        }
      });
      $('#reload').load(location.href + ' #reload');
    });

    //anularea cererii de prietenie
    $(document).on('click', '#cancel_friend', function () {
      var user_Id = $('#user_Id').val();

      $.ajax({
        url: '/group/' + room,
        type: 'POST',
        data: { user_Id: user_Id },
        //scoaterea notificarii din dropdown
        success: function () {
          $(this).parent().eq(1).remove();
        }
      });
      $('#reload').load(location.href + ' #reload');
    });
  });

  //event submit adauga prieten

  $('#add_friend').on('submit', function (e) {
    e.preventDefault();
    var receiverName = $('#receiverName').val();

    //trimiterea datelor catre baza de date folosind ajax
    $.ajax({
      url: '/group/' + room,
      type: 'POST',
      data: {
        receiverName: receiverName
      },
      success: function () {
        //un nou eveniment pentru notificarea in timp real friend req
        socket.emit('friendRequest',
          {
            receiver: receiverName,
            sender: sender
          },
          function () {
            console.log('Request sent');
          }
        );
      }
    });
  });

  //acceptarea cererii de prietenie
  $('#accept_friend').on('click', function () {
    var senderId = $('#senderId').val();
    var senderName = $('#senderName').val();

    $.ajax({
      url: '/group/' + room,
      type: 'POST',
      data: { senderId: senderId, senderName: senderName },
      //scoaterea notificarii din dropdown
      success: function () {
        $(this).parent().eq(1).remove();
      }
    });
    $('#reload').load(location.href + ' #reload');
  });

  //anulare cerere prietenie

  $('#cancel_friend').on('click', function () {
    var user_Id = $('#user_Id').val();

    $.ajax({
      url: '/group/' + room,
      type: 'POST',
      data: { user_Id: user_Id },
      //scoaterea notificarii din dropdown
      success: function () {
        $(this).parent().eq(1).remove();
      }
    });
    $('#reload').load(location.href + ' #reload');
  });
});
