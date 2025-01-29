const path = require('path');
const multer = require('multer');
const fs = require('fs');


const newDailyMenuStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/dailyMenu');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '_' + uniqueSuffix + fileExtension);
    }
});

const dailyMenuStorage = multer({ storage: newDailyMenuStorage }).single('menuImage');

module.exports = { dailyMenuStorage };