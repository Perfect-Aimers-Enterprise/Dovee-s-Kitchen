const express = require("express");
const router = express.Router();
// const { eventStorage } = require("../configuration/eventMgtConfig");

const {
  createEventMgt,
  getAllEventMgts,
  getSingleEventMgt,
  updateEventMgt,
  deleteEventMgt,
} = require("../controller/eventController");
const { uploadEventStorage } = require("../middleWare/upload");

// Routes
router.post("/createEventMgt", uploadEventStorage, createEventMgt);
router.get("/getAllEventMgts", getAllEventMgts);
router.get("/getSingleEventMgt/:id", getSingleEventMgt);
router.patch("/updateEventMgt/:id", uploadEventStorage, updateEventMgt);
router.delete("/deleteEventMgt/:id", deleteEventMgt);

module.exports = router;
