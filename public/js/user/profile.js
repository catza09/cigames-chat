$(document).ready(function () {
    $('.add-btn').on('click', function () {
        $('#add-input').click();
    });

    $('#add-input').on('change', function () {
        var addInput = $('#add-input');

        if (addInput.val() != '') {
            var formData = new FormData();
            formData.append('upload', addInput[0].files[0]);
            $('#completed').html('File uploaded Successfully');
            $.ajax({
                url: '/userupload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function () {
                    addInput.val('');
                },
            });
        }
        ShowImage(this);
    });
    //salvarea in baza de date datele modificate
    $('#profile').on('click', function () {
        var username = $('#username').val();
        var fullname = $('#fullname').val();
        var country = $('#country').val();
        var mantra = $('#mantra').val();
        var upload = $('#add-input').val();
        var image = $('#user-image').val();
        var valid = true;

        //adaugarea noua imagine 
        if (upload === '') {
            $('#add-input').val(image);
        }

        // //verificarea campurilor sa nu fie goale
        if (username == '' || fullname == '' || country == '' || mantra == '') {
            valid = false;
            $('#error').html('<div class="alert alert-danger">You can\'t submit an empty field</div>');
        } else {
            upload = $('#add-input').val();
            $('#error').html('');
        }
        //trimiterea datelor catre baza de date cu ajax
        if (valid === true) {
            $.ajax({
                url: '/settings/profile',
                type: 'POST',
                data: {
                    username: username,
                    fullname: fullname,
                    country: country,
                    mantra: mantra,
                    upload: upload
                },
                success: function () {
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

//vizualizarea imaginii de profil inainte de salvare in baza de date

function ShowImage(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#show_img').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

