var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var users = new Map();
var chatLog = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {

  console.log("A new user connected");
  
  var rn = getRandomName();
  users.set(socket.id, rn);
  socket.emit('username', rn);
  io.emit('updateUsers', Array.from(users.values()));

  // send chat log to new user
  socket.emit('chat log', chatLog);

  socket.on('chat message', function(msg) {

    //change nickname color
    if (msg.startsWith("/nickcolor ")) {
      var color = msg.slice(11);
      socket.emit('set color', color);
    } else if (msg.startsWith("/nick ")) {
      var newNickname = msg.slice(6);
      var nicknameExists = false;

      // check if nickname already exists
      for (const v of users.values()) {
        if (v === newNickname) {
          nicknameExists = true;
          break;
        }
      }

      if (nicknameExists) {
        var errorMsg = { 
          message: "nickname already exists"
        };
        socket.emit('nickname taken', errorMsg);
      } else {
        users.set(socket.id, newNickname);
        socket.emit('set nickname', newNickname);
        io.emit('updateUsers', Array.from(users.values()));
      }
    } else {

      if (msg.startsWith('/')) {
        console.log("invalid command");
      }

      var message = {
        time: buildTime(),
        nickname: users.get(socket.id),
        message: msg
      }

      chatLog.push(message);

      io.emit('chat message', message);
    }
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
  randomName = Math.floor(rn * 100).toString();

  return randomName;
}

function buildTime() {
  var date = new Date();
  var hour = date.getHours();
  var minutes = date.getMinutes();
  var time = hour + ":" + minutes;
  return time;
}