const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const app = express();
const session = require('express-session');
const PORT = process.env.PORT || 4000;
const path = require('path');
const server = http.createServer(app);
const io = socketIO(server);
const bodyParser = require('body-parser');
var Users = require('./usersList.js');


var {generateMessage} = require('./utils/generateMessage');

app.use(bodyParser.json());
app.use(session({
    secret:'Basu'
}))

var users = new Users();

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('join', (params, callback) => {
        if(!(typeof params.name === 'string' && typeof params.room === 'string' && params.name.trim().length > 0 &&  params.room.trim().length > 0)){
            callback('Not valid Room');
        }

        socket.join(params.room);
        users.deleteAndGetUpdatedList(socket.id);
        users.addUser(socket.id, params.name, params.room);
        socket.emit('GREETING',generateMessage('ADMIN','Welcome to chat app'));
        socket.broadcast.to(params.room).emit('GREETING',generateMessage('ADMIN',`${params.name} has joined`, params.name));
        io.to(params.room).emit('UserList', users.getUsers(params.room));
        callback();
    })

    socket.on('createMessage', (message, callback) => {
        console.log(message)
        io.to(message.room.room).emit('newMessage', generateMessage(message.from, message.message))
        callback('This is from server');
    })

    // socket.broadcast.emit('newMessage', {
    //     message:"New user connected"
    // })

    socket.on('disconnect', () => {
        var user = users.getUser(socket.id);
        console.log(user);
        io.to(user.room).emit('UserList', users.deleteAndGetUpdatedList(socket.id));
        io.to(user.room).emit('newMessage', generateMessage('ADMIN',`${user.name} left`));
    })
})

app.use(express.static(path.join(__dirname, '../public')));


server.listen(PORT, ()=> {
    console.log("Server started");
})