require('dotenv').config()
const express = require('express');
const cors = require('cors')
// const http = require('http');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const path = require('path')
const connectDB = require('./db/connectDB')
const userRoute = require('./routes/userRoute')
const productRoute = require('./routes/productRoute')
const specialProductRoute = require('./routes/specialProductRoute')
const orderRoute = require('./routes/orderRoute')
const adminGetOrderRoute = require('./routes/adminGetOrderRoute')
const userMessageRoute = require('./routes/userMessageRoute')
const subscribeRoute = require('./routes/subscriptionRoute')
const landingSectionRoute = require('./routes/landingSectionRoute')
const galleryRoute = require('./routes/galleryRoute')
const dailyMenuRoute = require('./routes/dailyMenuRoute')
const eventMgtRoute = require('./routes/eventMgtRoute')
const adminSecureRoute = require('./routes/adminAuthRoute')
const eventHeaderRoute = require('./routes/eventHeaderRoute')
const toggleEventRoute = require('./routes/toggleEventRoute')

const authentication = require('./middleWare/authentication')
// const { Server } = require('socket.io');

const app = express();

// const http = require('http');
// const { Server } = require('socket.io');
// const server = http.createServer(app);
// const io = new Server(server);

// Middleware to set cache control headers
// app.use((req, res, next) => {
//   // Set the Cache-Control headers to 'no-store' to prevent caching
//   res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
//   res.setHeader('Pragma', 'no-cache');
//   res.setHeader('Expires', '0');
//   next();
// });



// Serve static files
// app.use(express.static('public'));
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5501',  // For local testing
  'http://127.0.0.1:5501',  // Alternative localhost
  'https://doveeyskitchen.org',  // ✅ Your live domain
  'https://www.doveeyskitchen.org' // ✅ With "www" (if applicable)
];


app.use(cookieParser());
// secure: process.env.NODE_ENV === 'production',  // ✅ Secure in production, not in development
// app.use(cors({
//   origin: allowedOrigins,  
//   // credentials: true  // ✅ Allow cookies/sessions
// }));
app.use(cors({
  origin: allowedOrigins,
  credentials: true  // Allow cookies to be sent
}));

app.use(express.json())

app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/htmlFolder/Doviee2.html');
});

app.get('/doveeyskitchenadmin', (req, res) => {
  res.sendFile(__dirname + '/public/htmlFolder/adminAuth.html');
});

// MiddleWares 
app.use('/doveeysKitchen/api', userRoute)
app.use('/doveeysKitchen/product', productRoute)
app.use('/doveeysKitchen/order', authentication, orderRoute)
app.use('/doveeysKitchen/adminGetOrder', adminGetOrderRoute)
app.use('/doveeysKitchen/specialProduct', specialProductRoute)
app.use('/doveeysKitchen/message', userMessageRoute)
app.use('/notification', subscribeRoute)
app.use('/doveeysLanding', landingSectionRoute)
app.use('/galleryDisplay', galleryRoute)
app.use('/dailyMenuDisplay', dailyMenuRoute)
app.use('/doveeysKitchen/eventapi', eventMgtRoute)
app.use('/doveeysKitchen/safezone', adminSecureRoute)
app.use('/doveeysKitchen/eventHeader', eventHeaderRoute)
app.use('/doveeysKitchen/eventStatus', toggleEventRoute)


const fs = require('fs');
const logStream = fs.createWriteStream(__dirname + '/logs/app.log', { flags: 'a' });

app.use((req, res, next) => {
  logStream.write(`[${new Date().toISOString()}] ${req.method} ${req.url}\n`);
  next();
});

// Use this to log errors
process.on('uncaughtException', (err) => {
  logStream.write(`[${new Date().toISOString()}] Uncaught Exception: ${err.message}\n`);
});


const port = process.env.PORT || 3000

const start = async () => {
  try {
      await connectDB(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
      app.listen(port, () => {
          console.log(`server is listening on port ${port}`);
          
      })
  } catch (error) {
      console.log('error listening to port', error);
      
  }
}

start()



// WebSocket logic

// io.on('connection', (socket) => {
//   console.log('A user connected:', socket.id);

//   setInterval(() => {
//       const data = { message: 'Real-time update', timestamp: new Date() };
//       socket.emit('update', data);
//   }, 1000);

//   socket.on('disconnect', () => {
//       console.log('A user disconnected:', socket.id);
//   });
// });