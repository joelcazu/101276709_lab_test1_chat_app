const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./models/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./models/users');

const app = express();
app.use(express.json());
const server = http.createServer(app);
const io = socketio(server);

//DB Connection --------------------------------
mongoose.connect('mongodb+srv://joelsantos:260184***Jj@cluster0.puqtl.mongodb.net/sample_message?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// Set static folder ------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

const autoName = 'Chat robot ';

// Run when client connects ------------------------------
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current ------------------------------------
    socket.emit('message', formatMessage(autoName, 'Welcome to LabTest 1!'));

    // Broadcast when a user connects-----------------------
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(autoName, `${user.username} has joined the chat`)
      );

    // Send users and room info------------------------------
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage ----------------------------------

  socket.on('chatMessage', messages => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, messages));
  });

  // Runs when client disconnects -----------------------------
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(autoName, `${user.username} left the chat`)
      );

 // Submit users/ room info -------------------------------
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running`));