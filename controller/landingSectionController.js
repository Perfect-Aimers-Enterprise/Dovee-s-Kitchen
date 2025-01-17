const heroImageSchema = require('../model/landingPageModel')
const menuLandingSchema = require('../model/landingPageModel')
const specialLandingSchema = require('../model/landingPageModel')
const flyer1Schema = require('../model/landingPageModel')
const flyer2Schema = require('../model/landingPageModel')

const updateHeroImageSchema = async (req, res) => {
    try {

        const {id: heroImageId} = req.params
        
        const {heroImageName, heroImageDes} = req.body

        heroImageUrlFile = req.file.filename
        const updateHeroImage = await heroImageSchema.findOneAndUpdate(
            {_id: heroImageId},
            {heroImageName, heroImageDes, heroImage:heroImageUrlFile},
            { new: true, runValidators: true}
        )

        res.status(201).json({updateHeroImage})
    } catch (error) {
        res.status(500).json({error})
    }
}

const uploadMenuImageSchema = async (req, res) => {
    try {

        const {id: menuImageId} = req.params
        const {menuLandingName} = req.body
        menuLandingImageUrl = req.file.filename

        const menuImageSchema = await menuLandingSchema.findOneAndUpdate(
            {_id: menuImageId},
            {menuLandingName, menuLandingImage: menuLandingImageUrl},
            {new: true, runValidators: true}
        )

        res.status(201).json({menuImageSchema, message: 'menuLandingPage Uploaded Successfullyl'})
    } catch (error) {
        res.status(500).json(error)
    }
}

const uploadSpecialImageSchema = async (req, res) => {
    try {
        const {id: specialImageId} = req.params
        const {specialLandingName} = req.body

        specialLandingImageUrl = req.file.filename

        const specialImageSchema = await specialLandingSchema.findOneAndUpdate(
            {_id: specialImageId},
            {specialLandingName, specialLandingImage: specialLandingImage},
            {new: true, runValidators: true}
        )

        res.status(201).json({specialImageSchema, message: 'Special product uploaded successfull!!!'})
    } catch (error) {
        res.status(500).json(error)
    }
}

const uploadFlyer1Schema = async (req, res) => {
    try {

        const {id: flyer1ImageId} = req.params
        const {flyer1Title} = req.body
        flyer1ImageUrl = req.file.filename

        const flyer1Scheme = await flyer1Schema.findOneAndUpdate(
            {_id: flyer1ImageId},
            {flyer1Title, flyer1Image: flyer1ImageUrl},
            {new: true, runValidators: true}
        )

        res.status(201).json({flyer1Scheme, message: 'Flyer1 uploaded successfully!!!'})
    } catch (error) {
        res.status(500).json(error)
    }
}

const uploadFlyer2Schema = async (req, res) => {
    try {

        const {id: flyer2ImageId} = req.params
        const {flyer2Title} = req.body
        flyer2ImageUrl = req.file.filename

        const flyer2Scheme = await flyer2Schema.findOneAndUpdate(
            {_id: flyer2ImageId},
            {flyer2Title, flyer2Image: flyer2ImageUrl},
            {new: true, runValidators: true}
        )

        res.status(201).json({flyer2Scheme, message: 'Flyer2 uploaded successfully!!!'})
    } catch (error) {
        res.status(500).json(error)
    }
}


module.exports = {
    updateHeroImageSchema,
    uploadMenuImageSchema,
    uploadSpecialImageSchema,
    uploadFlyer1Schema,
    uploadFlyer2Schema
}