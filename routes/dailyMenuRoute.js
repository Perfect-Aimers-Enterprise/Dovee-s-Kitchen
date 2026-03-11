const express = require("express");
const router = express.Router();
// const { dailyMenuStorage } = require("../configuration/dailyMenuConfiguration");
const {
  createDailyMenu,
  getAllDailyMenus,
  getSingleDailyMenu,
  updateDailyMenu,
  deleteDailyMenu,
} = require("../controller/dailyMenuController");
const { dailyMenuStorage } = require("../middleWare/upload");

// Routes
router.post("/createDailyMenu", dailyMenuStorage, createDailyMenu);
router.get("/allDailyMenu", getAllDailyMenus);
router.get("/eachDailyMenu/:id", getSingleDailyMenu);
router.patch("/updateDailyMenu/:id", dailyMenuStorage, updateDailyMenu);
router.delete("/deleteDailyMenu/:id", deleteDailyMenu);

module.exports = router;
