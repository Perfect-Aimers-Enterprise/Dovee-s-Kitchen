const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema({

    galleryTitle: {type: String, required: true},
    galleryMedia: {type: String, required: true},
    galleryType: {
        type: String,
        enum: ["image", "video"], // Restrict to "image" or "video"
        required: true,
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
      },

}, { timestamps: true } )

module.exports = mongoose.model('gallery', gallerySchema)