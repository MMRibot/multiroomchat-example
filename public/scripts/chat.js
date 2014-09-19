// starts JavaScript's equivalent of a class that takes a single argument, a Socket.IO socket when instantiated

var Chat = function (socket){
  this.socket = socket;
};


// send chat methods

Chat.prototype.sendMessage = function(room, text){
  var message = {
    room: room,
    text: text
  };
  this.socket.emit('message', message);
};


// change rooms

Chat.prototype.changeRoom = function(room){
  this.socket.emit('join', {
    newRoom: room
  });
};


// processing chat commands

Chat.prototype.processCommand = function(command){
  var words = command.split(" "); // split(), splits a string at a defined seperator and returns an array of substrings
  command = words[0].substring(1, words[0].length).toLowerCase(); // parse command from first word - takes the first string from
  // words array and returns a subset of that string parsed to lowercase
  var message = false;

  switch(command) {
    case 'join':
      words.shift(); // The shift() method removes the first element from an array and returns that element
      var room = words.join(' ');
      this.changeRoom(room); // handle room changin/creating
      break;

    case 'nick':
      words.shift();
      var name = words.join(' ');
      this.socket.emit('nameAttempt', name); // handle name change attempts
      break;

    default:
      message = 'Unrecognized command.'; //return error message if command isn't recognized
      break;
  }
  return message;
};


//
