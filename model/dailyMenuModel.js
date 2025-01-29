const mongoose = require('mongoose');

const dailyMenuSchema = new mongoose.Schema({
    menuTitle: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    menuImage: {
        type: String,
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model('DailyMenu', dailyMenuSchema);
