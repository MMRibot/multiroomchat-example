// add logic to execute when page is fully loaded. handles client-side initiation of Socket.IO event handling

var socket = io.connect();

$(document).ready(function(){
  var chatApp = new Chat(socket);

  socket.on('nameResult', function(result){ // display result of a name-change attempt
    var message;

    if (result.success) {
      message = 'You are now known as ' + result.name + '.';
    } else {
      message = result.message;
    }
    $('#messages').append(divSystemContentElement(message));
  });

  socket.on('joinResult', function(result) { // display results of a room change
    $('#room').text(result.room);
    $('#messages').append(divSystemContentElement('Room changed.'));
  });

  socket.on('message', function(message){ // display received messages
    var newElement = $('<div></div>').text(message.text);
    $('#messages').append(newElement);
  });

  socket.on('rooms', function(rooms){ // display list of rooms available
    $('#room-list').empty();

    for(var room in rooms) {
      room = room.substring(1, room.length);
      if (room !== '') {
        $('#room-list').append(divEscapedContentElement(room));
      }
    }

    $('#room-list div').click(function(){ // allow click of a room name to change to that room
      chatApp.processCommand('/join' + $(this).text());
      $('#send-message').focus();
    });
  });

  setInterval(function(){ // request list of rooms available intermittently
    socket.emit('rooms');
  }, 1000);

  $('#send-message').focus();

  $('#send-form').submit(function(){ // allow submitting the form to send a chat message
    processUserInput(chatApp, socket);
    return false;
  });
});


// sanitizing function for XXS attacks

function divEscapedContentElement (message) {
  return $('<div></div>').text(message);
}


// display system created messages

function divSystemContentElement (message) {
  return $('<div></div>').html('<i>' + message + '</i>');
}


// processing raw user input

function processUserInput (chatApp, socket) {
  var message = $('#send-message').val();
  var systemMessage;

  if (message.charAt(0) === '/') { // if user input begins with slash, treat it as command
    systemMessage = chatApp.processCommand (message);
    if (systemMessage) {
      $('#messages').append(divSystemContentElement(systemMessage));
    }
  } else {
    chatApp.sendMessage($('#room').text(), message); // broadcasting noncommand input to other users
    $('#messages').append(divEscapedContentElement (message));
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));
  }

  $('#send-message').val('');
}
