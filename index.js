import express from 'express';
import socket from 'socket.io';

var app = express();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, function(){
    console.log('server is running on port 5000')
});

app.get('/', (req, res) => res.send({'hello': 'man'}));

const io = socket(server);

io.set('origins', '*:*');

io.on('connection', (socket) => {
    let handshakeData = socket.request;
    let username = handshakeData._query['userName'];
    io.emit('JOINED_ROOM', { username: username } );

    socket.on('SEND_MESSAGE', function(data) {
        console.log(data);
        io.emit('RECEIVE_MESSAGE', data);
    });
});