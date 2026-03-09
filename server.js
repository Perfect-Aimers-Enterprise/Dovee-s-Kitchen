const app = require("./app");

function applyCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

module.exports = function handler(req, res) {
  try {
    applyCors(res);
    return app(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};
