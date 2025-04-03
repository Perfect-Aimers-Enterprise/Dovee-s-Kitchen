const mongoose = require('mongoose');

const eventHeaderSchema = new mongoose.Schema({
    eventHeader: {
        type: String,
        required: true
    },
    eventHeaderDescription: {
        type: String
    }
}, { timestamps: true });


module.exports = mongoose.model('EventHeaderModel', eventHeaderSchema);
