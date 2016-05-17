var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/templates/index.html');
});

io.on('connection', function(socket) {
    console.log('a user connected');
    io.emit('chat message', 'a user has connected');
    socket.on('chat message', function(msg) {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
    socket.on('disconnect', function() {
        console.log('a user disconnected');
    });
});

http.listen(5000, function() {
    console.log('listening on *:5000');
});
