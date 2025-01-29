const express = require('express')
const router = express.Router()
const {createGallery, getGallery, deleteGallery} = require('../controller/galleryController')
const {uploadGallery} = require('../configuration/galleryConfiguration')

router.post('/createGallery', uploadGallery, createGallery)
router.get('/getGallery', getGallery)
router.delete('/deleteGallery/:id', deleteGallery)

module.exports = router