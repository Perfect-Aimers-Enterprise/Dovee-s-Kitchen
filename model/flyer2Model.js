const mongoose = require('mongoose')

const flyer2Schema = new mongoose.Schema({
    flyer2Title: {type: String},
    flyer2Image: {type: String}
})


module.exports = mongoose.model('Flyer2', flyer2Schema)