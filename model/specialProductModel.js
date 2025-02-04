const mongoose = require('mongoose')

const specialProductSchema = new mongoose.Schema({
    specialProductName: {type: String},
    specialDescription: {type: String},
    specialPrice: {type: Number},
    specialImage: {type: String},
    variations: [
        {
            size: { type: String}, // Size (e.g., 1L, 2L)
            price: { type: Number} // Price for the size
        }
    ]
}, { timestamps: true } )

module.exports = mongoose.model('specialProductSchema', specialProductSchema)