const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const menuStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "menuImages",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const specialStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "specialImages",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const heroImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "heroImage",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const menuLandingStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "menuLandingImage",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const specialLandingStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "specialLandingImage",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const flyer1Storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "flyer1",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const flyer2Storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "flyer2",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const galleryStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "galleryMedia",
    resource_type: "auto", // allows both images and videos
    allowed_formats: ["jpg", "png", "jpeg", "webp", "mp4", "mpeg"],
  },
});

const eventStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "doveeysKitchenFolder",
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const dailyMenuCloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dailyMenu",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const menuUpload = multer({ storage: menuStorage }).single("menuImage");
const specialUpload = multer({ storage: specialStorage }).single("specialImage");
const uploadHeroImage = multer({ storage: heroImageStorage }).single("heroImage");
const uploadMenuImage = multer({ storage: menuLandingStorage }).single("menuLandingImage");
const uploadSpecialImage = multer({ storage: specialLandingStorage }).single("specialLandingImage");
const uploadFlyer1 = multer({ storage: flyer1Storage }).single("flyer1Image");
const uploadFlyer2 = multer({ storage: flyer2Storage }).single("flyer2Image");
const uploadGallery = multer({ storage: galleryStorage }).single("galleryMedia");
const uploadEventStorage = multer({ storage: eventStorage }).single("eventImage");
const dailyMenuStorage = multer({ storage: dailyMenuCloudStorage }).single("menuImage");

module.exports = {
  menuUpload,
  specialUpload,
  uploadHeroImage,
  uploadMenuImage,
  uploadSpecialImage,
  uploadFlyer1,
  uploadFlyer2,
  uploadGallery,
  uploadEventStorage,
  dailyMenuStorage,
};
