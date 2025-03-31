const multer = require('multer')
const { v2: cloudinary } = require('cloudinary')
const { CloudinaryStorage } = require('multer-storage-cloudinary')

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Setup Multer Storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'doveeysKitchenFolder', // Folder name in Cloudinary
        format: async (req, file) => 'png', // Convert to PNG
        public_id: (req, file) => Date.now() + '-' + file.originalname
    }
})

const eventStorage = multer({ storage: storage }).single('eventImage')

module.exports = { eventStorage }
