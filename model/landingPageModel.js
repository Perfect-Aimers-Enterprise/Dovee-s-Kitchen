const mongoose = require('mongoose')

const heroImageSchema = new mongoose.Schema({
    heroImageName: {type: String},
    heroImageDes: {type: String},
    heroImage: {type: String}
})

const menuLandingSchema = new mongoose.Schema({
    menuLandingName: {type: String},
    menuLandingImage: {type: String}
})

const specialLandingSchema = new mongoose.Schema({
    specialLandingName: {type: String},
    specialLandingImage: {type: String}
})

const flyer1Schema = new mongoose.Schema({
    flyer1Title: {type: String},
    flyer1Image: {type: String}
})

const flyer2Schema = new mongoose.Schema({
    flyer2Title: {type: String},
    flyer2Image: {type: String}
})

module.exports = mongoose.model('heroImageSchema', heroImageSchema)
module.exports = mongoose.model('menuLandingSchema', menuLandingSchema)
module.exports = mongoose.model('specialLandingSchema', specialLandingSchema)
module.exports = mongoose.model('flyer1Schema', flyer1Schema)
module.exports = mongoose.model('flyer2Schema', flyer2Schema)