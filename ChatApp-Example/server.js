const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: { origin: "*" }
});

io.on('connection', socket => {
    console.log(socket.id, 'connected');
    socket.on('send-msg', msg => {
        io.emit('show-msg', msg, socket.id)
    })
})

http.listen(3000)