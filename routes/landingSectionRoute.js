const express = require('express')
const router = express.Router()

const {
    updateHeroImageSchema,
    uploadMenuImageSchema,
    uploadSpecialImageSchema,
    uploadFlyer1Schema,
    uploadFlyer2Schema
} = require('../controller/landingSectionController')

const {uploadHeroImage, uploadMenuImage, uploadSpecialImage, uploadFlyer1, uploadFlyer2} = require('../configuration/landingImageConfig')

router.patch('updateHeroImageSchema', uploadHeroImage, updateHeroImageSchema)
router.patch('uploadMenuImageSchema', uploadMenuImage, uploadMenuImageSchema)
router.patch('uploadSpecialImageSchema', uploadSpecialImage, uploadSpecialImageSchema)
router.patch('uploadFlyer1Schema', uploadFlyer1, uploadFlyer1Schema)
router.patch('uploadFlyer2Schema', uploadFlyer2, uploadFlyer2Schema)

module.exports = router