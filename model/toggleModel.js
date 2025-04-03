const mongoose = require('mongoose');

const toggleEventSchema = new mongoose.Schema({
    toggleEventStatus: {
        type: String,
        default: 'unChecked'
    }
}, { timestamps: true });


module.exports = mongoose.model('ToggleEventModel', toggleEventSchema);
