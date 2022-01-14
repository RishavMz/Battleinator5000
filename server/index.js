const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: '*' } });

const PORT = 5000;

app.get('/', (req, res) => {
    res.send("Its working");
});

const players = {};
players['id'] = [];
const chat = [];

io.on('connection', async(socket) => {
    console.log('A user '+ socket.handshake.auth.username+ 'just connected');

    socket.on('joined', (data)=>{
        players[data.id] = data;
        players['id'].push(data);
        console.log("Joined as :",data);
        io.emit('joined', data);
        socket.on('move', (val)=>{
            players[val.id].posx = val.posx;
            players[val.id].posz = val.posz;
        });
        socket.on('chatmessage', (data)=> {
            if(chat.length >= 5){    chat.shift();  }
            chat.push([data.sender, data.message]);
            io.emit(chat);
        })
    });
});

setInterval(()=>{
    io.emit('players', players);
    io.emit('chatmessage', chat);
}, 1000);

server.listen(PORT, () => {
    console.log('Server is up and listening on port ',PORT);
});