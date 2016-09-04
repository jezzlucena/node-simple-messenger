var serverURL = "http://localhost:3000"
var apiURI = "/messenger"

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}

$(document).ready(function(){
  autosize($("#send-area"));

  $('#username').val($.urlParam('userName'));

  $.ajax({
     url: serverURL + apiURI,
     type: "GET",
     dataType: "json",
     complete: function(data) {
       var messages = data.responseJSON;

       for (var i = 0; i < messages.length; i++){
         var newMessage = $('.message.template').clone();
         newMessage.removeClass('template');
         newMessage.find('.user-name').html(messages[i]['user_name'] + ':');
         newMessage.find('.content').html(messages[i]['content']);

         $('.messages-container').append(newMessage);
       }

       setTimeout(function(){
         $(".messages").animate({ scrollTop: $('.messages-container').height() }, 1000);
       }, 300);
     }
  });

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
  var error = false;

  if($('#username').val()){
    $('.username-area-error').hide();
  }else{
    $('.username-area-error').show();
    shake($('#username'));
    error = true;
  }

  if($('#send-area').val()){
    $('.send-area-error').hide();
  }else{
    $('.send-area-error').show();
    shake($('#send-area'));
    error = true;
  }

  if (error) {
    return false;
  }

  var data = {
    'user_name': $('#username').val(),
    'content': $('#send-area').val()
  }

  $.ajax({
     url: serverURL + apiURI,
     data: JSON.stringify(data),
     type: "POST",
     dataType: "json",
     contentType: "application/json",
     complete: function(data) {
       if($.urlParam('userName') != $('#username').val()){
         location.href = location.href.split("?")[0] + "?userName=" + $('#username').val();
       }else{
         location.reload();
       }
       $('#send-area').val('');
       console.log(data);
     }
  });
}

function shake(div){
    var interval = 100;
    var distance = 10;
    var times = 4;

    $(div).css('position','relative');

    for(var iter=0;iter<(times+1);iter++){
        $(div).animate({
            left:((iter%2==0 ? distance : distance*-1))
            },interval);
    }//for

    $(div).animate({ left: 0},interval);

}//shake
