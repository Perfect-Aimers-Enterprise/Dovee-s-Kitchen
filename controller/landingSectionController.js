const fs = require('fs');
const path = require('path');

const HeroImage= require('../model/landingPageModel');
const MenuLanding = require('../model/menuLandingSchema')
const SpecialLanding = require('../model/specialLandingSchema')
const Flyer1 = require('../model/flyer1Model')
const Flyer2 = require('../model/flyer2Model')


const uploadHeroImageSchema = async (req, res) => {
    try {
        const { heroImageName, heroImageDes } = req.body;
        const heroImageUrlFile = req.file.filename;

        const existingHeroImage = await HeroImage.findOne();
        if (existingHeroImage) {
            const existingImagePath = path.join(__dirname, '../public/image/heroImage', existingHeroImage.heroImage);

            // Step 2: Check if the file exists
            if (fs.existsSync(existingImagePath)) {
                // Step 3: Delete the existing image file
                fs.unlinkSync(existingImagePath)
            };

            const updatedHeroImage = await HeroImage.findByIdAndUpdate(
                existingHeroImage._id,
                { heroImageName, heroImageDes, heroImage: heroImageUrlFile },
                { new: true, runValidators: true }
            );
            return res.status(200).json({ updatedHeroImage, message: 'Hero image updated successfully!' });
        } else {
            const newHeroImage = await HeroImage.create({
                heroImageName,
                heroImageDes,
                heroImage: heroImageUrlFile
            });
            return res.status(201).json({ newHeroImage, message: 'Hero image created successfully!' });
        }

    } catch (error) {
        res.status(500).json({ error });
    }
};

const getHeroImage = async (req, res) => {
    try {
        const getHeroImageVar = await HeroImage.find()

        res.status(201).json(getHeroImageVar)
    } catch (error) {
        res.status(500).json(error, message = "Couldn't get HeroImage to display")
    }
}

// Menu Image Controller
const createMenuImage = async (req, res) => {
    try {
        const { menuLandingName, menuLandingDes } = req.body;
        const menuLandingImageUrl = req.file.filename;

        const existingMenuImages = await MenuLanding.find();
        if (existingMenuImages.length >= 4) {
            return res.status(400).json({ message: 'Maximum of 4 menu images allowed!' });
        }

        const newMenuImage = await MenuLanding.create({
            menuLandingName,
            menuLandingDes,
            menuLandingImage: menuLandingImageUrl
        });
        res.status(201).json({ newMenuImage, message: 'Menu image uploaded successfully!' });
    } catch (error) {
        res.status(500).json({ error });
    }
};

const uploadMenuImageSchema = async (req, res) => {
    try {

        const {id: menuImageId} = req.params
        const {menuLandingName, menuLandingDes} = req.body
        menuLandingImageUrl = req.file.filename

        const menuImageSchema = await MenuLanding.findOneAndUpdate(
            {_id: menuImageId},
            {menuLandingName, menuLandingDes, menuLandingImage: menuLandingImageUrl},
            {new: true, runValidators: true}
        )

        res.status(201).json({menuImageSchema, message: 'menuLandingPage Uploaded Successfullyl'})
    } catch (error) {
        res.status(500).json(error)
    }
}

const getAllMenuImage = async (req, res) => {
    try {
        const getAllMenuImageVar = await MenuLanding.find()

        res.status(201).json(getAllMenuImageVar)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getSingleMenuImage = async (req, res) => {
    try {

        const {id:singleMenuId} = req.params
        const getSingleMenuImageVar = await MenuLanding.findOne({_id:singleMenuId})
        res.status(201).json(getSingleMenuImageVar)

    } catch (error) {
        console.log(error);
    }
}

// Special Image Controller
const createSpecialImage = async (req, res) => {
    try {
        const { specialLandingName, specialLandingDes } = req.body;
        const specialLandingImageUrl = req.file.filename;

        const existingSpecialImages = await SpecialLanding.find();
        if (existingSpecialImages.length >= 4) {
            return res.status(400).json({ message: 'Maximum of 4 special images allowed!' });
        }

        const newSpecialImage = await SpecialLanding.create({
            specialLandingName,
            specialLandingDes,
            specialLandingImage: specialLandingImageUrl
        });
        res.status(201).json({ newSpecialImage, message: 'Special image uploaded successfully!' });
    } catch (error) {
        res.status(500).json({ error });
    }
};

const uploadSpecialImageSchema = async (req, res) => {
    try {
        const {id: specialImageId} = req.params
        const {specialLandingName, specialLandingDes} = req.body
        specialLandingImageUrl = req.file.filename

        const specialImageSchema = await SpecialLanding.findOneAndUpdate(
            {_id: specialImageId},
            {specialLandingName, specialLandingDes, specialLandingImage: specialLandingImageUrl},
            {new: true, runValidators: true}
        )

        res.status(201).json({specialImageSchema, message: 'Special product uploaded successfull!!!'})
    } catch (error) {
        res.status(500).json(error)
    }
}

const getAllSpecialImage = async (req, res) => {
    try {
        const getAllSpecialImageVar = await SpecialLanding.find()
        res.status(201).json(getAllSpecialImageVar)
    } catch (error) {
        res.status(500).json(error)
    }
}

const getSingleSpecialImage = async (req, res) => {
    try {

        const {_id: singleSpecialId} = req.params
        const getSingleSpecialImageVar = await SpecialLanding.findOne({_id: singleSpecialId})

        res.status(201).json(getSingleSpecialImageVar)
    } catch (error) {
        res.status(500).json(error)
    }
}

// Flyer 1 Image Controller (Only 1 flyer)
const uploadFlyer1Schema = async (req, res) => {
    try {
        const { flyer1Title } = req.body;
        const flyer1ImageUrl = req.file.filename;

        const existingFlyer1 = await Flyer1.findOne();
        if (existingFlyer1) {

            const existingImagePath = path.join(__dirname, '../public/image/flyer1', existingFlyer1.flyer1Image);

            // Step 2: Check if the file exists
            if (fs.existsSync(existingImagePath)) {
                // Step 3: Delete the existing image file
                fs.unlinkSync(existingImagePath)
            };

            const updatedFlyer1 = await Flyer1.findByIdAndUpdate(
                existingFlyer1._id,
                { flyer1Title, flyer1Image: flyer1ImageUrl },
                { new: true, runValidators: true }
            );
            return res.status(200).json({ updatedFlyer1, message: 'Flyer1 updated successfully!' });
        } else {
            const newFlyer1 = await Flyer1.create({
                flyer1Title,
                flyer1Image: flyer1ImageUrl
            });
            return res.status(201).json({ newFlyer1, message: 'Flyer1 created successfully!' });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};

const getFlyer1Schema = async (req, res) => {
    try {
        const getFlyer1Var = await Flyer1.find()
        res.status(201).json(getFlyer1Var)
    } catch (error) {
        res.status(500).json({error, message: 'Flyer1 not found'})
    }
}

// Flyer 2 Image Controller (Only 1 flyer)
const uploadFlyer2Schema = async (req, res) => {
    try {
        const { flyer2Title } = req.body;
        const flyer2ImageUrl = req.file.filename;

        console.log('uploadFlyerSchema');

        const existingFlyer2 = await Flyer2.findOne();
        console.log('Existing Flyer2 Test Schema', existingFlyer2);
        
        if (existingFlyer2) {
            // Step 1: Retrieve the existing image file path
            const existingImagePath = path.join(__dirname, '../public/image/flyer2', existingFlyer2.flyer2Image);

            // Step 2: Check if the file exists
            if (fs.existsSync(existingImagePath)) {
                // Step 3: Delete the existing image file
                fs.unlinkSync(existingImagePath)
            };

            const updatedFlyer2 = await Flyer2.findByIdAndUpdate(
                existingFlyer2._id,
                { flyer2Title, flyer2Image: flyer2ImageUrl },
                { new: true, runValidators: true }
            );

            console.log('New Flyer2 Test Schema', updatedFlyer2);
            
            return res.status(200).json({ updatedFlyer2, message: 'Flyer2 updated successfully!' });
        } else {
            const newFlyer2 = await Flyer2.create({
                flyer2Title,
                flyer2Image: flyer2ImageUrl
            });
            return res.status(201).json({ newFlyer2, message: 'Flyer2 created successfully!' });
        }
    } catch (error) {
        res.status(500).json({ error });
    }
};


const getFlyer2Schema = async (req, res) => {
    try {
        const getFlyer2Var = await Flyer2.find()
        res.status(201).json(getFlyer2Var)
    } catch (error) {
        res.status(500).json({error, message: 'Flyer2 not found'})
    }
}

module.exports = {
    uploadHeroImageSchema,
    getHeroImage,
    createMenuImage,
    uploadMenuImageSchema,
    getAllMenuImage,
    getSingleMenuImage,
    getAllSpecialImage,
    getSingleSpecialImage,
    createSpecialImage,
    uploadSpecialImageSchema,
    uploadFlyer1Schema,
    uploadFlyer2Schema,
    getFlyer1Schema,
    getFlyer2Schema
};
