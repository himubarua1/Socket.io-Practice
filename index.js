const express = require('express');
const app = express();
const http = require('http');
const expressServer = http.createServer(app);
const {Server} = require('socket.io');
const io = new Server(expressServer);


// DATA SEND SERVER TO CLIENT

io.on('connection', function(socket){
    console.log('New User Connected')

    setInterval(function(){
        let d = new Date();
        let t = d.getTime();
        socket.emit("myEvent", t); 
    }, 500)

});


// DATA RCVD CLIENT FROM SERVER

io.on('connection', function(socket){
    console.log('New User Connected')
    socket.on('message', function(msg){
        console.log(msg);
    })
})


// BROADCAST

io.on('connection', function(socket){
    io.sockets.emit("MyBroadcast", "Hello Everyone !")
})



// NAMESPACE

let buyNsp = io.of("/buy");

buyNsp.on('connection', function(socket){

    buyNsp.emit("MyEvent", "hello buy")
});

let sellNsp = io.of("/sell");

sellNsp.on('connection', function(socket){

    sellNsp.emit("MyEvent", "hello sell")
});



// ROOMS

io.on('connection', function(socket){
    socket.join('kitchen-room');

    let sizeOfKitchen = io.sockets.adapter.rooms.get('kitchen-room').size;

    io.sockets.in('kitchen-room').emit('cooking',"Fried Rice cooking =" + sizeOfKitchen)
    io.sockets.in('kitchen-room').emit('boiling',"Boiling Water")



    socket.join('bed-room');
    io.sockets.in('bed-room').emit('sleep',"i am sleeping")
    io.sockets.in('bed-room').emit('rest',"i am taking rest")
})











app.get('/', function(req,res){
   res.sendFile(__dirname+"/index.html")
});



expressServer.listen(3050, function(){
    console.log("Server run @ 3000")
});