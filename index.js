const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.use(express.static('src'))
app.use(express.static('assets'))


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


io.on('connection', (socket) => {
    console.log(socket.id+', conectado ...')

    socket.on('cardRender', (msg) => {
      io.emit('cardRender', msg);
    });

    socket.on('tarefaUmov', (msg) => {
      io.emit('tarefaUmov', msg);
    });
  });

server.listen(3000, () => {
  console.log('listening on *:3000');
});