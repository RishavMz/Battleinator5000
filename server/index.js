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
var socks = [];
const TTL = 30;
var numClients=0;

io.on('connection', async(socket) => {
    console.log('A user '+ socket.handshake.auth.username+ 'just connected');
    socks.push([socket,TTL])
    socket.on('joined', (data)=>{
        numClients++;
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
        socket.on('heartbeat', ()=>{
            for(let i=0; i<socks.length; i++){
                if(socks[i][0]==socket){
                    socks[i][1]=30;
                    break;
                }
            }
        })
        socket.on('disconnect', function () {
            numClients--;
       });
    });
});



setInterval(()=>{
    if(numClients>0){
        io.emit('players', players);
        io.emit('chatmessage', chat);
        const rem = [];
        for(var i=0; i<socks.length; i++){
            socks[i][1]--;
            if(socks[i][1]>0){
                rem.push(socks[i]);
            } else {
                socks[i][0].emit('disconnected');
                socks[i][0].disconnect();
            }
            //console.log(socks[i][1]);
        }
        //console.log(numClients);
       socks = rem;
    }
}, 1000);

server.listen(PORT, () => {
    console.log('Server is up and listening on port ',PORT);
});