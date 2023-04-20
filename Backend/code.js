const express=require('express');
const {createServer}=require('http');
const {Server}=require('socket.io');
const shortid=require('shortid');
const app=express();
const httpServer=createServer(app);
const io=new Server(httpServer,{cors:{origin:'*'}})


io.on('connection',(socket)=>{
console.log('Connected');
socket.on('createRoom',()=>{
    const roomId=shortid.generate();
    socket.join(roomId);
    socket.emit('roomJoined',roomId);
})

socket.on('joinRoom',(data)=>{
if(io.sockets.adapter.rooms.has(data.id)){
socket.join(data.id);
}
else{
socket.emit('roomError');
socket.disconnect();
}
})

socket.on('message',(data)=>{
 socket.broadcast.to(data.id).emit({username:data.username,message:data.message});
 console.log(data.username);
 console.log(data.message);
})
});

httpServer.listen(3000);
console.log('Server started on port 3000');
