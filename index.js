const helper = require('./app/helper.js');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const rooms = {};

app.use(express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/validate', (req, res) => {
  let validGames = ['war'];
  let gameIsValid = validGames.indexOf(req.query.game) > -1;
  let nameIsValid = /[a-zA-Z0-9]{3,20}/.test(req.query.roomName);
  let ret = {
    valid: gameIsValid && nameIsValid,
    params: {
      game: req.query.game,
      roomName: req.query.roomName,
      name: req.query.name,
      code: helper.generateRoomCode()
    }
  }
  rooms[ret.params.code] = ret.params;
  res.send(ret);
});

io.on('connection', (socket) => {
  console.log(socket.id, 'connected!');
  socket.on('join', (params) => {
    socket.name = params.name;
    socket.join(params.code, () => {
      let room = io.sockets.adapter.rooms[params.code];
      console.log(room.length);
      io.emit('joined', {name: params.roomName, code: params.code});
    });
  });
  socket.on('disconnect', () => {
    console.log(socket.id, 'disconnected!');
  });
});

io.on('disconnection', (socket) => {
  console.log(socket.id);
});

http.listen(3000, () => {
  console.log('listening on *:3000');
})