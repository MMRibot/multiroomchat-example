var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = { };
var namesUsed = [ ];
var currenteRoom = { };

// Defines the connection handling logic, calling a number of helper functions

exports.listen = function(server){

  io = socketio.listen(server); // start SocketIo server, allowing it to piggyback on existing HTTP server

  io.set('log level', 1);

  io.sockets.on('connection', function(socket) { // define how each user connection will be handled

    guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed); // Assign user a guestname when they connect

    joinRoom(socket, 'Lobby'); // Place user in Lobby room when they connect

    handleMesssageBroadcasting(socket, nickNames); // handle user messages, namechange attempts, and room creation/changes

    handleNameChangeAttempt(socket, nickNames, namesUsed);

    handleRoomJoining(socket);

    socket.on('rooms', function(){ // Provide user with list of occupied rooms on request
      socket.emit('rooms', io.sockets.manager.rooms);
    });

    handleClientDisconnection(socket, nickNames, namesUsed); // Define cleanup logic when user disconnects
  });
};
