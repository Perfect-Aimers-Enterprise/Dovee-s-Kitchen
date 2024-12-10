require('dotenv').config()
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/htmlFolder/menu2.html');
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  // Handle chat messages
  socket.on('chatMessage', (msg) => {
    io.emit('chatMessage', msg); // Broadcast message to all clients
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
