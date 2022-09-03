const path = require('path');
const express = require('express')
const app = express();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const game = require('./public/javascript/gameData');

app.use(express.static(path.join(__dirname, "public")))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/views/index.html'));
});

io.on('connection', socket => {
    console.log(`Client with id ${socket.id} connected`);
    
    socket.on('landing-form', (obj) => {
        if(obj.nickname === "") { 
            socket.emit('retry-landing-form', `Please enter a nickname!`);
            return;
        }

        // User is joining an already existing room
        if(obj.room != "") {
            console.log(`${obj.nickname} wants to join room ${obj.room}`);

            var index = game.rooms.map(function(e) { return e.roomId; }).indexOf(obj.room);
            if(index >= 0) {
                game.rooms[index].peopleCount += 1;
                socket.join(obj.room);
                console.log(`${obj.nickname} joined ${obj.room}`);
            }
            else {
                socket.emit('retry-landing-form', `Room ${obj.room} does not exist!`);
                return;
            }
        }
        // User wants to create a new room
        else {
            console.log(`${obj.nickname} wants to create a room`);
            var roomId = game.idGen(6)
            // Check for duplicate room Id
            var index = game.rooms.map(function(e) { return e.roomId; }).indexOf(obj.room);
            if(index >= 0) {
                socket.emit('retry-landing-form', 'Please refresh and try again!');
                return;
            }
            else {
                game.rooms.push(new game.room(1, roomId));
                socket.join(roomId);
                console.log(`Created room ${roomId} for ${obj.nickname}`);
            }
        }

        socket.emit('start-game', 'Ready to start the game!');
    })

    socket.on('start-game', () => {
        
    })

    socket.on('disconnect', () => {
        console.log(`Client with id ${socket.id} wants to disconnect`);
        console.log(socket.rooms);
    })
})

httpServer.listen(3000);