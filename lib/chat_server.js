var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};

// Defines the connection handling logic, calling a number of helper functions

exports.listen = function(server){

  io = socketio.listen(server); // start SocketIo server, allowing it to piggyback on existing HTTP server

  io.set('log level', 1);

  io.sockets.on('connection', function(socket) { // define how each user connection will be handled

    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed); // Assign user a guestname when they connect

    joinRoom(socket, 'Lobby'); // Place user in Lobby room when they connect

    handleMessageBroadcasting(socket, nickNames); // handle user messages, namechange attempts, and room creation/changes

    handleNameChangeAttempts(socket, nickNames, namesUsed);

    handleRoomJoining(socket);

    socket.on('rooms', function(){ // Provide user with list of occupied rooms on request
      socket.emit('rooms', io.sockets.manager.rooms);
    });

    handleClientDisconnection(socket, nickNames, namesUsed); // Define cleanup logic when user disconnects
  });
};

// Assign a guest name

function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
  var name = 'Guest' + guestNumber; // Generate new guest name
  nickNames[socket.id] = name; // associate guest name with client connection ID
  socket.emit('nameResult', { // let user know their guest name
    success: true,
    name: name
  });
  namesUsed.push(name); // note that guest name is now used
  return guestNumber + 1; // increment counter used to generate guest names
}


// Joining rooms

function joinRoom(socket, room){
  socket.join(room); // make user join room
  currentRoom[socket.id] = room; // note that user is now in this room
  socket.emit('joinResult', {room: room}); // let user know they are now in new room
  socket.broadcast.to(room).emit('message', { // let other users in room know that user has joined
    text: nickNames[socket.id] + ' has joined ' + room + '.'
  });

  var usersInRoom = io.sockets.clients(room); // determine what other users are in the room as user
  if (usersInRoom.length > 1) { // if other users in room summarazie who they are
    var usersInRoomSummary = 'Users currently in ' + room + ': ';
    for (var index in usersInRoom) {
      var userSocketId = usersInRoom[index].id;
      if (userSocketId !== socket.id) {
        if ( index > 0 ) {
          usersInRoomSummary += ', ';
        }
        usersInRoomSummary += nickNames[userSocketId];
      }
    }
    usersInRoomSummary += '.';
    socket.emit('message', {text: usersInRoomSummary}); // send summary of other users in the room to the server
  }
}


// handling name changes

function handleNameChangeAttempts (socket, nickNames, namesUsed){
  socket.on('nameAttempt', function(name){ // add listener for nameAttempt events
    if( name.indexOf('Guest') === 0) { // don't allow nicknames to begin with Guest
      socket.emit('nameResult', {
        success: false,
        message: 'Names cannot begin with "Guest".'
      });
    } else {
      if (namesUsed.indexOf(name) === -1) { //if name ins't already registered, register it
        var previousName = nickNames[socket.id];
        var previousNameIndex = namesUsed.indexOf(previousName);
        namesUsed.push(name);
        nickNames[socket.id] = name;
        delete namesUsed[previousNameIndex]; // remove previous name to make available to other clients

        socket.emit('nameResult', {
          success: true,
          name: name
        });

        socket.broadcast.to(currentRoom[socket.id]).emit('message', {
          text: previousName + ' is now known as ' + name + '.'
        });
      } else {
        socket.emit('nameResult', { // send error to client if name is already registered
          success: false,
          message: 'That name is already in use.'
        });
      }
    }
  });
}


// sending chat messages to room

function handleMessageBroadcasting (socket){
  socket.on('message', function(message){
    socket.broadcast.to(message.room).emit('message', {
      text: nickNames[socket.id] + ': ' + message.text
    });
  });
}


// creating rooms

function handleRoomJoining (socket){
  socket.on('join', function(room){
    socket.leave(currentRoom[socket.id]);
    joinRoom(socket, room.newRoom);
  });
}


// handling user disconnection

function handleClientDisconnection (socket){
  socket.on('disconnect', function(){
    var nameIndex = namesUsed.indexOf(nickNames[socket.id]);
    delete namesUsed[socket.id];
    delete nickNames[socket.id];
  });
}
