const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    eventTitle: {
        type: String,
        required: true
    },
    eventPrice: {
        type: Number,
        required: true
    },
    eventImage: {
        type: String,
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model('EventMgt', eventSchema);
