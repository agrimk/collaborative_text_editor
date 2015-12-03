var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var hash = {};
var text = "";
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', function(socket){
  console.log("New user connected : " + socket.id);
  hash[socket.id] = 0;
  console.log(hash);
  // io.emit("New user connected : " + socket.id);
  // io.emit('text editor', msg);

  // to show the id of connected user in client side
  socket.on('connected_user', function(msg){
  	console.log("New User");
  	msg.id = socket.id;
  	msg.text = text;
  	msg["connected-user"] = JSON.stringify(hash);
  	io.sockets.emit('connected_user', msg);
  });

  socket.on('current_position', function(msg){
  	msg.id = socket.id;
  	socket.broadcast.emit ('current_position', msg);
  });

  socket.on('text editor', function(msg){
    msg.id = socket.id;
    text = msg.text;
    // io.emit('text editor', msg);
    hash[msg.id] = msg.caretPos;
    console.log(msg);
    console.log(JSON.stringify(hash));
    msg["connected-user"] = JSON.stringify(hash);
    socket.broadcast.emit('text editor', msg);
  });
});



http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:5000');
});
