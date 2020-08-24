$(document).ready(function () {
    var socket = io();
    var paramOne = $.deparam(window.location.pathname);
    //split ultima parte din url pentru a putea fi folosit pentru participantii chat-ului privat
    var newParam = paramOne.split('.');

    //inlocuirea in url
    swap(newParam, 0, 1);
    var paramTwo = newParam[0] + '.' + newParam[1];

    socket.on('connect', function () {
        var params = {
            room1: paramOne,
            room2: paramTwo
        };

        //emiterea unui nou eveniment pentru mesajul privat
        socket.emit('join PM', params);
        //ascultarea evenimentului de refresh din home
        socket.on('new refresh', function () {
            $('#reload').load(location.href + ' #reload');
        });
    });


    //trimiterea datelor catre baza de date a chaturlui privat pe baza evenimentului de click
    $(document).on('click', '#messageLink', function () {
        var chatId = $(this).data().value;
        $.ajax({
            url: '/chat/' + paramOne,
            type: 'POST',
            data: { chatId: chatId },
            success: function () { }
        });
        socket.emit('refresh', {

        });
    });
});

//crearea functiei de inversare
function swap(input, value_1, value_2) {
    var temp = input[value_1];
    input[value_1] = input[value_2];
    input[value_2] = temp;
}