var http = require('http'); // built-in http module provides HTTP server and client functionality
var fs = require('fs'); // Built-in fs module provides filesystem-related functionality
var path = require('path'); // Built-in path module provides filesystem path-related functionality
var mime = require('mime'); // Add-on mime module provides ability to derive a MIME type based on a filename extension
var cache = {}; // Cache object is where the contents of cached files are stored


var server = http.createServer(function(request, response){ // create HTTP server, using anonymous function to define per-request behavior
  var filePath = false;

  if (request.url === '/') {
    filePath = 'public/index.html'; // Determine HTML file to be served by default
  } else {
    filePath = 'public' + request.url; // Translate URL path to relative file path
  }

  var absPath = './' + filePath;
  serveStatic(response, cache, absPath); // serve static file
});

var chatServer = require('./lib/chat_server');
chatServer.listen(server); //uses the already defined HTTP server and shares the same TCP/IP port and starts the socket.IO server

// Three helper functions used for serving static HTTP files.

// The first handles the sending of 404 errors when a file is requested but does not exist.
// The second serves file data
// The third determines if a file is chached or not and if so serves it. If a file isn't chached it reads from disk and serves it
//and if it doesn't exist it returns an http 404 response.

// 1st helper function

function send404(response){
  response.writeHead(404, {'Content-Type': 'text/plain'});
  response.write('Error 404: resource not found.');
  response.end();
}


// 2nd helper function

function sendFile (response, filePath, fileContents){
  response.writeHead(200, {'Content-Type': mime.lookup(path.basename(filePath))});
  response.end(fileContents);
}

// 3rd hlper function

function serveStatic(response, cache, absPath){
  if (cache[absPath]) { // check if file is chached in memory
    sendFile(response, absPath, cache[absPath]); // serve file from memory
  } else {
    fs.exists(absPath, function(exists){ // check if file exists
      if (exists) {
        fs.readFile(absPath, function(err, data){ // read file from disk
          if (err) {
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data); // serve file read from disk
          }
        });
      } else {
        send404(response); // send HTTP 404 response
      }
    });
  }
}




server.listen(3000, function(){
  console.log("Listening on port 3000");
});
