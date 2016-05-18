// http://jamesallardice.com/how-to-check-if-a-javascript-object-has-a-certain-value/
Object.prototype.hasOwnValue = function(val) {
    for(var prop in this) {
        if(this.hasOwnProperty(prop) && this[prop] === val) {
            return true;
        }
    }
    return false;
};

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var nicknames = {};

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/templates/index.html');
});

io.on('connection', function(socket) {
    nicknames[socket.id] = 'user' + Math.floor(Date.now() / 1000); // current timestamp to have a random nickname
    console.log('a user connected: ' + nicknames[socket.id]);
    socket.on('nickname', function(msg) {
        msg = msg.substring(0, 16).trim(); // truncate long nicknames
        if (nicknames.hasOwnProperty(socket.id) && nicknames[socket.id] === msg) {
          return false;
        }
        if (nicknames.hasOwnValue(msg)) {
          socket.emit('nicknamenotavailable', 'Nickname not available');
          return false;
        }
        nicknames[socket.id] = msg;
        socket.emit('nickname', msg); // pass back valid nickname
    })
    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        io.emit('chat message', nicknames[socket.id] + ': ' + msg);
    });
    socket.on('disconnect', function() {
        console.log('a user disconnected');
        io.emit('chat message', 'a user has disconnected');
        delete nicknames[socket.id];
    });
});

http.listen(5000, function() {
    console.log('listening on *:5000');
});
