// require("dotenv").config();
// const app = require("./app");
// const connectDB = require("./db/connectDB");

// const fs = require("fs");
// const logStream = fs.createWriteStream(__dirname + "/logs/app.log", { flags: "a" });

// app.use((req, res, next) => {
//   logStream.write(`[${new Date().toISOString()}] ${req.method} ${req.url}\n`);
//   next();
// });

// process.on("uncaughtException", (err) => {
//   logStream.write(`[${new Date().toISOString()}] Uncaught Exception: ${err.message}\n`);
// });

// const port = process.env.PORT || 3000;

// const start = async () => {
//   try {
//     await connectDB(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     server.listen(port, () => {
//       console.log(`server is listening on port ${port}`);
//     });
//   } catch (error) {
//     console.log("error listening to port", error);
//   }
// };

// start();

const app = require("./app");
const connectDB = require("./db/connectDB");

function applyCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

module.exports = async function handler(req, res) {
  try {
    applyCors(res);
    if (req.method === "OPTIONS") {
      return res.status(200).end();
    }
    await connectDB();
    return app(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};
