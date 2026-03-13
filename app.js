require("dotenv").config();
const express = require("express");
const cors = require("cors");
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
const paystackRoute = require("./routes/Paystack/route");

const app = express();
// const server = createServer(app);

// Update Express CORS to match
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(express.json());

// Health check / root route
// app.get("/", (req, res) => {
//   res.status(200).send("This server is live");
// });

// app.use("/v1", routes);

app.use(bodyParser.json());
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, fiiePath) => {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.setHeader("Surrogate-Control", "no-store");
    },
  }),
);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/htmlFolder/Doviee2.html");
});

app.get("/doveeyskitchenadmin", (req, res) => {
  res.sendFile(__dirname + "/public/htmlFolder/adminAuth.html");
});

// MiddleWares
app.use("/doveeysKitchen/api", userRoute);
app.use("/doveeysKitchen/product", productRoute);
app.use("/doveeysKitchen/order", orderRoute);
app.use("/doveeysKitchen/adminGetOrder", adminGetOrderRoute);
app.use("/doveeysKitchen/specialProduct", specialProductRoute);
app.use("/doveeysKitchen/message", userMessageRoute);
app.use("/notification", subscribeRoute);
app.use("/doveeysLanding", landingSectionRoute);
app.use("/galleryDisplay", galleryRoute);
app.use("/dailyMenuDisplay", dailyMenuRoute);
app.use("/doveeysKitchen/eventapi", eventMgtRoute);
app.use("/doveeysKitchen/safezone", adminSecureRoute);
app.use("/doveeysKitchen/eventHeader", eventHeaderRoute);
app.use("/doveeysKitchen/eventStatus", toggleEventRoute);
app.use("/api/paystack", paystackRoute);

module.exports = app;
