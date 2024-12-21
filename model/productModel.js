const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    menuProductName: {type: String},
    menuDescription: {type: String},
    menuPrice: {type: Number},
    menuImage: {type: String},

    specialProductName: {type: String},
    specialDescription: {type: String},
    specialPrice: {type: Number},
    specialImage: {type: String},
}, { timestamps: true } )

module.exports = mongoose.model('productSchema', productSchema)