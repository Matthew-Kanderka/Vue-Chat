var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var user_names = ["Spiderman", "Ironman", "The Hulk", "Black Widow", "Thor"];
var users = new Map();

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {

  console.log("A new user connected");
  
  var rn = getRandomName();
  users.set(socket.id, rn);
  socket.emit('username', rn);
  io.emit('updateUsers', Array.from(users.values()));

  socket.on('chat message', function(msg) {
    console.log(msg);

    //change nickname color
    if (msg.startsWith("/nickcolor ")) {
      var color = msg.slice(11);
      socket.emit('set color', color);
    }

    //change nickname
    if (msg.startsWith("/nick ")) {
      var newNickname = msg.slice(6);
      socket.emit('set nickname', newNickname);
    }

    var message = {
      time: buildTime(),
      nickname: users.get(socket.id),
      message: msg
    }

    io.emit('chat message', message);
  });

  socket.on('disconnect', function() {
    console.log("user disconnected");
    users.delete(socket.id);
    io.emit('updateUsers', Array.from(users.values()));
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});

function getRandomName() {

  var randomName = '';

  var rn = Math.random();
  randomName = Math.floor(rn * 100);

  return randomName;
}

function buildTime() {
  var date = new Date();
  var hour = date.getHours();
  var minutes = date.getMinutes();
  var time = hour + ":" + minutes;
  return time;
}