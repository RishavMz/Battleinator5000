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

io.on('connection', (socket) => {
    console.log('A user '+ socket.handshake.auth.username +' connected with email ID ', socket.handshake.auth.email);
    socket.on('message', (data)=>{
        console.log("Message: ",data);
    socket.emit('data', '124567890');
    setTimeout(()=>{
        socket.emit('data', '124567890');
    }, 10000);
    });
});

server.listen(PORT, () => {
    console.log('Server is up and listening on port ',PORT);
});