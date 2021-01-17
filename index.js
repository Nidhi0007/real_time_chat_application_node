var fs = require("fs");
const http = require('http');
const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const socketio = require('socket.io');

// important libraries
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs')
app.use(express.static('public'))
// server start
const server = http.createServer(app);
const io = socketio(server, {
});

// run when client connects
io.on("connection", function (socket) {
  console.log("Made socket connection");
  socket.username = "Anonymous"

    socket.on('change_username', data => {
        socket.username = data.username
    })


    //handle the new message event
    socket.on('new_message', data => {
        console.log("new message")
        io.sockets.emit('receive_message', {message: data.message, username: socket.username})
    })
    socket.on('typing', data => {
      socket.broadcast.emit('typing', {username: socket.username})
  })

});
// homepage
app.get('/', (req, res) => {
  res.render('index')
})
const port = process.env.PORT || 3000

server.listen(port, () => console.log(`Server has started.`));