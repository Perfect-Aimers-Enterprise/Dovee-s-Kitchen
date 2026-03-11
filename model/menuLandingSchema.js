const mongoose = require("mongoose");

const menuLandingSchema = new mongoose.Schema({
  menuLandingName: { type: String },
  menuLandingDes: { type: String },
  menuLandingImage: { type: String },
  privateLandingImage: { type: String },
});

module.exports = mongoose.model("MenuLanding", menuLandingSchema);
