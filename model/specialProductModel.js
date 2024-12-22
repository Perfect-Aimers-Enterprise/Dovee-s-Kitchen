const mongoose = require('mongoose')

const specialProductSchema = new mongoose.Schema({
    specialProductName: {type: String},
    specialDescription: {type: String},
    specialPrice: {type: Number},
    specialImage: {type: String},
}, { timestamps: true } )

module.exports = mongoose.model('specialProductSchema', specialProductSchema)