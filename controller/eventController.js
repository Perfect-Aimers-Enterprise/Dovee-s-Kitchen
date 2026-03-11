const EventMgt = require("../model/eventMgtModel");
const path = require("path");
const fs = require("fs");

const createEventMgt = async (req, res) => {
  try {
    const { eventTitle, eventPrice } = req.body;
    const eventImage = req.file.path;
    const privateEventImage = req.file.filename;

    console.log(eventImage);

    if (!eventTitle || !eventPrice || !eventImage) {
      return res.status(400).json({ error: "Incomplete credentials" });
    }

    const createMenuVar = await EventMgt.create({
      eventTitle,
      eventPrice,
      eventImage,
      privateEventImage,
    });

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

    const existingEvent = await EventMgt.findById(id);

    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (req.file) {
      // delete old image from cloudinary
      if (existingEvent.privateEventImage) {
        await cloudinary.uploader.destroy(existingEvent.privateEventImage);
      }

      // save new image
      updatedFields.eventImage = req.file.path;
      updatedFields.privateEventImage = req.file.filename;
    }

    const updatedEvent = await EventMgt.findByIdAndUpdate(id, updatedFields, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updatedEvent);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteEventMgt = async (req, res) => {
  try {
    const { id } = req.params;

    const existingEvent = await EventMgt.findById(id);

    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    // delete image from cloudinary
    if (existingEvent.privateEventImage) {
      await cloudinary.uploader.destroy(existingEvent.privateEventImage);
    }

    // delete from database
    const deletedEvent = await EventMgt.findByIdAndDelete(id);

    res.status(200).json({
      message: "Event deleted successfully",
      deletedEvent,
    });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = {
  createEventMgt,
  getAllEventMgts,
  getSingleEventMgt,
  updateEventMgt,
  deleteEventMgt,
};
