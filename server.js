require('dotenv').config()
const express = require('express');
const cors = require('cors')
// const http = require('http');
const path = require('path')
const connectDB = require('./db/connectDB')
const userRoute = require('./routes/userRoute')
const productRoute = require('./routes/productRoute')
const specialProductRoute = require('./routes/specialProductRoute')
const orderRoute = require('./routes/orderRoute')
const adminGetOrderRoute = require('./routes/adminGetOrderRoute')

const authentication = require('./middleWare/authentication')
// const { Server } = require('socket.io');

const app = express();
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
// const server = http.createServer(app);
// const io = new Server(server);

// Serve static files
// app.use(express.static('public'));
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/htmlFolder/regLog.html');
});


// MiddleWares 
app.use('/doveeysKitchen/api', userRoute)
app.use('/doveeysKitchen/product', productRoute)
app.use('/doveeysKitchen/order', authentication, orderRoute)
app.use('/doveeysKitchen/adminGetOrder', adminGetOrderRoute)

app.use('/doveeysKitchen/specialProduct', specialProductRoute)

// Socket.IO connection
// io.on('connection', (socket) => {
//   console.log('A user connected');
//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });

  // Handle chat messages
//   socket.on('chatMessage', (msg) => {
   // Broadcast message to all clients
//     io.emit('chatMessage', msg);
//   });
// });

const port = process.env.PORT || 3000

const start = async () => {
  try {
      await connectDB(process.env.MONGO_URI)
      app.listen(port, () => {
          console.log(`server is listening on port ${port}`);
          
      })
  } catch (error) {
      console.log('error listening to port', error);
      
  }
}

start()
