require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { server } = require("./app");
// const http = require('http');
const bodyParser = require("body-parser");
const path = require("path");
const connectDB = require("./db/connectDB");
const userRoute = require("./routes/userRoute");
const productRoute = require("./routes/productRoute");
const specialProductRoute = require("./routes/specialProductRoute");
const orderRoute = require("./routes/orderRoute");
const adminGetOrderRoute = require("./routes/adminGetOrderRoute");
const userMessageRoute = require("./routes/userMessageRoute");
const subscribeRoute = require("./routes/subscriptionRoute");
const landingSectionRoute = require("./routes/landingSectionRoute");
const galleryRoute = require("./routes/galleryRoute");
const dailyMenuRoute = require("./routes/dailyMenuRoute");
const eventMgtRoute = require("./routes/eventMgtRoute");
const adminSecureRoute = require("./routes/adminAuthRoute");
const eventHeaderRoute = require("./routes/eventHeaderRoute");
const toggleEventRoute = require("./routes/toggleEventRoute");

const authentication = require("./middleWare/authentication");
// const { Server } = require('socket.io');

const app = express();

// Middleware to set cache control headers

// app.use((req, res, next) => {
//   res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
//   res.setHeader('Pragma', 'no-cache');
//   res.setHeader('Expires', '0');
//   next();
// });

// Serve static files

// app.use(cors());

// app.use(express.json())

// routings

// Use this to log errors
const fs = require("fs");
const logStream = fs.createWriteStream(__dirname + "/logs/app.log", { flags: "a" });

app.use((req, res, next) => {
  logStream.write(`[${new Date().toISOString()}] ${req.method} ${req.url}\n`);
  next();
});

process.on("uncaughtException", (err) => {
  logStream.write(`[${new Date().toISOString()}] Uncaught Exception: ${err.message}\n`);
});

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    server.listen(port, () => {
      console.log(`server is listening on port ${port}`);
    });
  } catch (error) {
    console.log("error listening to port", error);
  }
};

start();

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
