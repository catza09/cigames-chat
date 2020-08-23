$(document).ready(function () {
  $('#favorite').on('submit', function (e) {
    e.preventDefault();
    var id = $('#id').val();
    var gameName = $('#game_Name').val();
    $.ajax({
      url: '/home',
      type: 'POST',
      data: { id: id, gameName: gameName },
      success: function () {
        //  console.log(gameName);
      },
    });
  });
});
