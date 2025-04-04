const EventMgt = require('../model/eventMgtModel');
const path = require('path');
const fs = require('fs');

const createEventMgt = async (req, res) => {
    try {
        const { eventTitle, eventPrice } = req.body;
        const eventImage = req.file.path;

        console.log(eventImage);
        

        if (!eventTitle || !eventPrice || !eventImage) {
            return res.status(400).json({ error: "Incomplete credentials" });
        }

        const createMenuVar = await EventMgt.create({ eventTitle, eventPrice, eventImage });

        console.log(createMenuVar);
        
        res.status(201).json({ createMenuVar });
    } catch (error) {
        res.status(500).json(error);
    }
};

const getAllEventMgts = async (req, res) => {
    try {
        const menuVar = await EventMgt.find();
        res.status(200).json(menuVar);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getSingleEventMgt = async (req, res) => {
    try {
        const { id } = req.params;
        const menuVar = await EventMgt.findById(id);

        if (!menuVar) {
            return res.status(404).json({ error: "Menu not found" });
        }
        res.status(200).json(menuVar);
    } catch (error) {
        res.status(500).json(error);
    }
};

const updateEventMgt = async (req, res) => {
    try {
        const { id } = req.params;
        const { eventTitle, eventPrice } = req.body;
        let updatedFields = { eventTitle, eventPrice };

        if (req.file) {
            const newImage = req.file.path;
            updatedFields.menuImage = newImage;

            const existingMenu = await EventMgt.findById(id);

            if (existingMenu) {
                const oldImagePublicId = existingMenu.eventImage.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`doveeysKitchenFolder/${oldImagePublicId}`);
            }

        }

        const updatedMenu = await EventMgt.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true });

        res.status(200).json(updatedMenu);
    } catch (error) {
        res.status(500).json(error);
    }
};

const deleteEventMgt = async (req, res) => {
    try {
        const { id } = req.params;

        console.log(id);
        

        const existingMenu = await EventMgt.findById(id)

        console.log(existingMenu);
        
        if (!existingMenu) {
            return res.status(404).json({ error: "Menu not found" });
        }

        const oldImagePublicId = existingMenu.eventImage.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`doveeysKitchenFolder/${oldImagePublicId}`);


        const menuVar = await EventMgt.findByIdAndDelete(id);

        res.status(200).json(menuVar);
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = {
    createEventMgt,
    getAllEventMgts,
    getSingleEventMgt,
    updateEventMgt,
    deleteEventMgt
};
