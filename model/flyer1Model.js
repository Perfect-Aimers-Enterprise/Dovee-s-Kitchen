const mongoose = require('mongoose')

const flyer1Schema = new mongoose.Schema({
    flyer1Title: {type: String},
    flyer1Image: {type: String}
})

module.exports = mongoose.model('Flyer1', flyer1Schema)