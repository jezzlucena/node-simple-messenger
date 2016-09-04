var serverURL = "http://localhost:3000/"
var apiURI = "/messenger"

$(document).ready(function(){
  autosize($("#send-area"));

  $('#send-area').keypress(function (e) {
    if (e.which == 13) {
      if(!e.shiftKey){
        sendMessage();
        return false;
      }
    }
  });

  $('.send-btn').click(function (e) {
    sendMessage();
  });
});

function sendMessage() {
  var data = {
    'data': {
      'user_name': $('#user-name').val(),
      'content': $('#send-area').val()
    }
  }

  $.ajax({
     url: serverURL + apiURI,
     data: data,
     type: "POST",
     dataType: "json",
     complete: function(data) {
     }
  }).done(function(response){
    console.log(response);
  });
}
