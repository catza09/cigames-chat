$(document).ready(function () {

    //adaugare joc favorit in profil
    $('#favGameBtn').on('click', function () {
        var favGame = $('#favGame').val()
        var valid = true;

        if (favGame === '') {
            valid = false;
            $('#error').html('<div class="alert alert-danger">You can\'t submit an empty field</div>');
        } else {
            $('#error').html('');
        }

        if (valid === true) {
            $.ajax({
                url: '/settings/interests',
                type: 'POST',
                data: {
                    favGame: favGame
                },
                success: function () {
                    $('#favGameType').val('');
                    setTimeout(function () {
                        window.location.reload();
                    }, 200);
                }
            })
        } else {
            return false;
        }
    });

    //adaugare tip joc favorit in profil
    $('#favGameTypeBtn').on('click', function () {
        var favGameType = $('#favGameType').val()
        var valid = true;

        if (favGameType === '') {
            valid = false;
            $('#error').html('<div class="alert alert-danger">You can\'t submit an empty field</div>');
        } else {
            $('#error').html('');
        }

        if (valid === true) {
            $.ajax({
                url: '/settings/interests',
                type: 'POST',
                data: {
                    favGameType: favGameType
                },
                success: function () {
                    $('#favGameType').val('');
                    setTimeout(function () {
                        window.location.reload();
                    }, 200);
                }
            })
        } else {
            return false;
        }
    });
});