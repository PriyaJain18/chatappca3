const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(router);

io.on('connect', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));








// 
// SERVER SIDE  : .............NOT WORKING!!!

// const express = require("express");
// const socketio = require("socket.io");
// const http = require('http');
// const router = require('./router');
// const { addUser, removeUser, getUser ,getUsersInRoom } = require('./users.js');

// const PORT = process.env.PORT || 5000;  //process.env.port for after deployment whatever port we'll asign 

// const app = express();  //instance of express
// // for website requests -> http but for real-time applications -> prefer socket.io
// const server = http.createServer(app);
// const io = socketio(server)     //instance of socketio

// io.on('connection',(socket)=> {
//     console.log('We have a new connection!!');

//     socket.on('join',({name,room}, callback)=>{        //receiving data from Front-end to Back-end 
//         // console.log(name,room);
//         const { error , user } = addUser({id: socket.id, name, room});

//         if(error) return callback(error);   //callback function send data to the front-end with parameter error 

//         // 'message' : by server machines
//         socket.emit('message',{user: 'admin',text: `${user.name} welcome to the room ${user.room}` });
//         socket.broadcast.to(user.room).emit('message',{user: 'admin',text: `${user.name} has joined the room .` });

//         // 'sendMessage' : by users to each other 

//         socket.join(user.room);
//         // CHECK ABOVE 

//         callback();
//     })
//     socket.on('sendMessage',(message,payload) => {
//         const user = getUser(socket.id);
//         io.to(user.room).emit('message',{ user: user.name, text:message });
//         callback() //so we can do something on front-end after receiving this sendMesssage on front-end 
//     })
//     socket.on('disconnect',()=>{
//         console.log('The user has left!!')
//     })
// })

// app.use(router);

// server.listen(PORT, () => console.log(`Server has started on port http://localhost:${PORT}`));