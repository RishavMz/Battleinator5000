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

const points = [];
const trees = [];
const bush = [];
const ENEMY_COUNT = 10;
const OBSTACLE_COUNT = 10;
for(let i=0; i<ENEMY_COUNT; i++){
    points.push({
        id: i,
        posx: Math.random()*1024 - 512, 
        posz: Math.random()*1024 - 512
    });
}
for(let i=0; i<OBSTACLE_COUNT; i++){
    trees.push({
        id: i,
        posx: Math.random()*1024 - 512, 
        posz: Math.random()*1024 - 512
    });
}
for(let i=0; i<OBSTACLE_COUNT; i++){
    bush.push({
        id: i,
        posx: Math.random()*1024 - 512, 
        posz: Math.random()*1024 - 512
    });
}

const players = {};
players['id'] = [];

io.on('connection', async(socket) => {
    console.log('A user '+ socket.handshake.auth.username +' connected with email ID ', socket.handshake.auth.email);

    socket.on('joined', (data)=>{
        players[data.id] = data;
        players['id'].push(data);
        console.log("Joined as :",data);
        io.emit('joined', data);
        socket.on('move', (val)=>{
            console.log("moov")
            io.emit('movement', {id: data.id, posx: val.posx, posz: val.posz});
        });
    });
});

setInterval(()=>{
    io.emit('players', players);
}, 5000);

server.listen(PORT, () => {
    console.log('Server is up and listening on port ',PORT);
});