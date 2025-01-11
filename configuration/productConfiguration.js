const path = require('path')
const multer = require('multer')
const fs = require('fs')



const newMenuStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/menuImage')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() +'_'+ Math.round(Math.random()*1E9)
        const fileExtension = path.extname(file.originalname)
        cb(null, file.fieldname +'_'+ uniqueSuffix+fileExtension)
    }
})

const menuStorage = multer({storage: newMenuStorage}).single('menuImage')


const newSpecialStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/specialImage')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() +'_'+ Math.round(Math.random()*1E9)
        const fileExtension = path.extname(file.originalname)
        cb(null, file.fieldname +'_'+ uniqueSuffix+fileExtension)
    }
})

const specialStorage = multer({storage: newSpecialStorage}).single('specialImage')

module.exports = {menuStorage, specialStorage}