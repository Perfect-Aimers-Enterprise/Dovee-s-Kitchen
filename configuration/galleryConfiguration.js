const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure the upload directory exists
const uploadDirectory = 'public/image/GalleryVideo';
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const galleryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set the destination directory
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
        // Create a unique filename
        const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1e9);
        const fileExtension = path.extname(file.originalname); // Get file extension
        const baseName = path.basename(file.originalname, fileExtension); // Get file name without extension
        cb(null, `${baseName}_${uniqueSuffix}${fileExtension}`);
    }
});

// File filter to allow only images or videos
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "video/mp4", "video/mpeg"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only images or videos are allowed"), false);
    }
};

// Multer instance for uploading a single file
const uploadGallery = multer({
    storage: galleryStorage,
    fileFilter
}).single('galleryMedia');

module.exports = { uploadGallery };
