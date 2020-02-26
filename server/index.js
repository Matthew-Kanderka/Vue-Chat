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
  
  // when a client connects, check if a nickname cookie exists
  socket.emit('check cookie');

  // 'new user' event will be triggered when a client connects and doesn't have a cookie
  socket.on('new user', function() {
    var rn = getRandomName();
    var color = "FFFFFF";
    users.set(socket.id, {'nickname':rn, 'color': color});
    socket.emit('nickname', rn);
    socket.emit('set cookie', rn, color);
    io.emit('updateUsers', Array.from(users.values()));
  });

  // 'set existing user' event will be triggered when a client connects and has a cookie
  socket.on('set existing user', function(userObject) {

    // check if username from cookie is already taken by another client. If so, generate a new random nickname otherwise set the nickname.
    if (doesNicknameExist(userObject.nickname)) {
      userObject.nickname = getRandomName();
    }

    users.set(socket.id, userObject);
    socket.emit('nickname', userObject.nickname);
    io.emit('updateUsers', Array.from(users.values()));
  });

  // send chat log to user
  socket.emit('chat log', chatLog);

  socket.on('chat message', function(msg) {

    //change nickname color
    if (msg.startsWith("/nickcolor ")) {
      var color = msg.slice(11);
      var colorRegex = /^[0-9a-fA-F]{6}$/;

      var result = colorRegex.exec(color);
      if (result != null) {

        var nick = users.get(socket.id).nickname;
        users.set(socket.id, {'nickname':nick, 'color': color});
        socket.emit('set cookie', nick, color);
        socket.emit('set color', color);
      } else {

        var message = {
          message: "Invalid color"
        }

        socket.emit('chat message', message);
      }

    } else if (msg.startsWith("/nick ")) {
      var newNickname = msg.slice(6);

      if (doesNicknameExist(newNickname)) {
        var errorMsg = { 
          message: "nickname already exists"
        };
        socket.emit('nickname taken', errorMsg);
      } else {
        users.set(socket.id, newNickname);
        socket.emit('set nickname', newNickname);
        socket.emit('set cookie', newNickname);
        io.emit('updateUsers', Array.from(users.values()));
      }

    } else {

      if (msg.startsWith('/')) {

        var message = {
          message: "Invalid command"
        }

        socket.emit('chat message', message);
      } else {

console.log(users.get(socket.id));

        var message = {
          time: buildTime(),
          nickname: users.get(socket.id).nickname,
          message: msg,
          color: users.get(socket.id).color
        }

        chatLog.push(message);

        io.emit('chat message', message);
    }
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

// will generate a random name that does not already exist
function getRandomName() {
  var randomName = '';

  do {
  var rn = Math.random();
  randomName = Math.floor(rn * 100).toString();
  } while(doesNicknameExist(randomName));

  return randomName;
}

// will build time with format hh:mm
function buildTime() {
  var date = new Date();
  var hour = date.getHours();
  var minutes = date.getMinutes();

  if (hour < 10) {
    hour = '0' + hour;
  }

  if (minutes < 10) {
    minutes = '0' + minutes;
  }

  var time = hour + ":" + minutes;
  return time;
}

// Checks if nickname already exists by iterating through user map
function doesNicknameExist(newNickname) {

  var nicknameExists = false;

  for (const v of users.values()) {
    if (v === newNickname) {
      nicknameExists = true;
      break;
    }
  }

  return nicknameExists;
}