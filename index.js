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


// io.on('connection', (socket) => {
//     let handshakeData = socket.request;
//     let username = handshakeData._query['userName'];
//     io.emit('JOINED_ROOM', { username: username } );

//     socket.on('SEND_MESSAGE', function(data) {
//         console.log(data);
//         io.emit('RECEIVE_MESSAGE', data);
//     });
// });

io.sockets.on('connection', (socket) => {
    let handshakeData = socket.request;
    let username = handshakeData._query['userName'];
    let current_room = 'RoomA';

    socket.on('create', (room) => {
        socket.leave(current_room);
        socket.join(room);
        current_room = room;
        console.log('joined', room);
        io.sockets.in(room).emit('JOINED_ROOM', { username: username, room: room } );
        // io.sockets.in(room).emit('message', 'what is going on, party people?');
    });

    socket.on('SEND_MESSAGE', function(data) {
        console.log(data);
        io.sockets.in(current_room).emit('RECEIVE_MESSAGE', data);
        // io.to(current_room).emit(data);
    });
})