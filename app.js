/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const chatsModels = require('./src/models/Chat');
const usersRouter = require('./src/routers/User');
const chatsRouter = require('./src/routers/Chats');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(usersRouter);
app.use(chatsRouter);
app.use(express.static(`${__dirname}/uploads`));

const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`a client connected with id ${socket.id}`);

  // menerima req send-message
  socket.on('send-message', (payload) => {
    // eslint-disable-next-line no-unused-vars
    const { pengirim, pesan } = payload;
    // mengirim req get-message
    io.emit('get-message', payload); // mengirim ke semua listener
    socket.broadcast.emit('get-message-broadcast', payload); // mengirim ke semua kecuali pengirim
  });

  socket.on('login', (room) => {
    console.log(`a user jined room${room}`);
    socket.join(room);
  });

  socket.on('get-chat-history', (payload) => {
    const { sender, receiver } = payload;
    chatsModels.getChatHistory(sender, receiver).then((result) => {
      console.log(result);
      io.to(sender).emit('get-history-chat', result);
    }).catch((err) => {
      console.log(err);
    });
  });

  socket.on('send-message-private', (payload) => {
    console.log(payload);
    const { sender, receiver, msg } = payload;
    try {
      chatsModels.insertChats(sender, receiver, msg).then((result) => {
        console.log(result);
        io.to(receiver).emit('get-message-private', payload);
      }).cath((err) => {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
  });
  socket.on('delete-message', (payload) => {
    console.log(payload);
    const { data, receiver, sender } = payload;
    try {
      chatsModels.deleteChats(data).then((result) => {
        chatsModels.getChatHistory(sender, receiver).then((result2) => {
          io.to(receiver, sender).emit('get-delete-message', result2);
        }).catch((err) => {
          console.log(err);
        });
      }).cath((err) => {
        console.log(err);
      });
    } catch (error) {
      console.log(error);
    }
  });

  socket.on('disconnect', () => {
    console.log('a client disconnected');
  });
});

const { port } = process.env;
httpServer.listen(port, () => {
  console.log(`Service running on port ${port}`);
});
module.exports = app;
