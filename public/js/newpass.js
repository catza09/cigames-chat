$(document).ready(function () {

    $('#newpass').on('submit', function (e) {
        e.preventDefault();
        var newpassword = $('#newpassword').val();
        var token = $('#token').val();
        var valid = true;
        if (newpassword === '') {
            valid = false;
            $('#error').html('<div class="alert alert-danger">You can\'t submit an empty field</div>');
        } else {
            $('#error').html('');
        }

        if (valid === true) {
            $.ajax({
                url: '/resetPassword/' + token,
                type: 'POST',
                data: {
                    newpassword: newpassword
                },
                success: function () {

                }
            })
        } else {
            return false;
        }

    })

});