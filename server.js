var port = 8080;

// Require the modules we need
var http = require('http');

// Create a http server with a callback handling all requests
var httpServer = http.createServer(function(request, response) {
  console.log((new Date()) + ' Received request for ' + request.url);
  response.writeHead(200, {'Content-type': 'text/plain'});
  response.end('Hello world\n');
});

// Setup the http-server to listen to a port
httpServer.listen(port, function() {
  console.log((new Date()) + ' HTTP server is listening on port ' + port);
});






// ----------- WEBSOCKET ------------

var clients=[];

// Require the modules we need
var WebSocketServer = require('websocket').server;

// Create an object for the websocket
// <a href='https://github.com/Worlize/WebSocket-Node/wiki/Documentation'>https://github.com/Worlize/WebSocket-Node/wiki/Documentation</a>
var wss = new WebSocketServer({
  httpServer: httpServer,
  autoAcceptConnections: false
});

wss.on('connect', function(connection){
  console.log("Connection: "+connection);
});

// Create a callback to handle each connection request
wss.on('request', function(request) {

  var connection = request.accept();

  console.log((new Date()) + ' Connection accepted from origin: ' + request.origin);

  clients.push(connection);

  // Callback to handle each message from the client
  connection.on('message', function(message) {
      if (message.type === 'utf8') {
          console.log('Received Message: ' + message.utf8Data);

          var data = JSON.parse(message.utf8Data);

          if (data.text[0] == '/') {
            console.log("Received command from "+data.name);

            var cmd = data.text.split('/')[1];
            console.log(cmd);
          }

          //var c;
          //for (c in )
          connection.sendUTF('Hi '+data.name+' ! You just sent me the text: '+data.text);
      }
      else if (message.type === 'binary') {
          console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
          connection.sendBytes(message.binaryData);
      }
  });

  // Callback when client closes the connection
  connection.on('close', function(reasonCode, description) {
      console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
  });
});

function addClient(origin, name) {

}
