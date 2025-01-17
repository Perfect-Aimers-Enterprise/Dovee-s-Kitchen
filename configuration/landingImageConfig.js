const multer = require('multer')
const path = require('path')

const heroImageUpload = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/heroImage')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() +'_'+ Math.round(Math.random()*1E9)
        const fileExtension = path.extname(file.originalname)
        cb(null, file.fieldname +'_'+ uniqueSuffix+fileExtension)
    }
})

const menuImageUpload = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/menuLandingImage')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() +'_'+ Math.round(Math.random()*1E9)
        const fileExtension = path.extname(file.originalname)

        cb(null, file.fieldname +'_'+ uniqueSuffix+fileExtension)
    }
})

const specialImageUpload = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/specialLandingImage')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() +'_'+ Math.round(Math.random()*1E9)
        const fileExtension = path.extname(file.originalname)
        cb(null, file.fieldname +'_'+ uniqueSuffix+fileExtension)
    }
})

const flyer1Upload = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/flyer1')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() +'_'+ Math.round(Math.random()*1E9)
        const fileExtension = path.extname(file.originalname)
        cb(null, file.fieldname +'_'+ uniqueSuffix+fileExtension)
    }
})

const flyer2Upload = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/image/flyer2')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() +'_'+ Math.round(Math.random()*1E9)
        const fileExtension = path.extname(file.originalname)
        cb(null, file.fieldname +'_'+ uniqueSuffix+fileExtension)
    }
})


const uploadHeroImage = multer({storage: heroImageUpload}).single('heroImage')
const uploadMenuImage = multer({storage: menuImageUpload}).single('menuLandingImage')
const uploadSpecialImage = multer({storage: specialImageUpload}).single('specialLandingImage')
const uploadFlyer1 = multer({storage: flyer1Upload}).single('flyer1Image')
const uploadFlyer2 = multer({storage: flyer2Upload}).single('flyer2Image')

module.exports = {uploadHeroImage, uploadMenuImage, uploadSpecialImage, uploadFlyer1, uploadFlyer2} 