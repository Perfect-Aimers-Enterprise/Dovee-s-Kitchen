const gallery = require("../model/gallery");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../config/cloudinary");

const createGallery = async (req, res) => {
  try {
    const { galleryTitle, galleryType } = req.body;

    const galleryUrl = req.file.path;
    const privateGalleryMedia = req.file.filename;

    if (!galleryTitle || !galleryType || !galleryUrl) {
      return res.status(400).json({ error: "Incomplete credentials" });
    }

    const createGalleryVar = await gallery.create({
      galleryTitle,
      galleryType,
      galleryMedia: galleryUrl,
      privateGalleryMedia,
    });

    res.status(201).json({ createGalleryVar });
  } catch (error) {
    res.status(500).json(error);
  }
};

const getGallery = async (req, res) => {
  try {
    const galleryVar = await gallery.find();

    res.status(200).json(galleryVar);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteGallery = async (req, res) => {
  try {
    const { id: deleteGalleryId } = req.params;

    const galleryVar = await gallery.findById(deleteGalleryId);

    if (!galleryVar) {
      return res.status(404).json({ message: "Gallery media not found" });
    }

    // delete media from cloudinary
    if (galleryVar.privateGalleryMedia) {
      await cloudinary.uploader.destroy(galleryVar.privateGalleryMedia, {
        resource_type: "auto", // important because it could be video or image
      });
    }

    // delete from database
    await gallery.findByIdAndDelete(deleteGalleryId);

    res.status(200).json({
      message: "Gallery media deleted successfully",
      galleryVar,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createGallery,
  getGallery,
  deleteGallery,
};
