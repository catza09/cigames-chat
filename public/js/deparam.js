(function ($) {
  //obtinerea ultimei parti din url pentru crearea unui chat privat
  $.deparam =
    $.deparam ||
    function (uri) {
      if (uri === undefined) {
        uri = window.location.pathname;
      }

      var pathname = window.location.pathname;
      var arr = pathname.split('/');
      var privateRoom = arr.pop();

      return privateRoom;
    };
})(jQuery);
