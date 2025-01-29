const express = require('express');
const router = express.Router();
const {dailyMenuStorage} = require('../configuration/dailyMenuConfiguration'); // Middleware for handling image uploads
const {
    createDailyMenu,
    getAllDailyMenus,
    getSingleDailyMenu,
    updateDailyMenu,
    deleteDailyMenu
} = require('../controller/dailyMenuController');

// Routes
router.post('/createDailyMenu', dailyMenuStorage, createDailyMenu);
router.get('/allDailyMenu', getAllDailyMenus);
router.get('/eachDailyMenu/:id', getSingleDailyMenu);
router.patch('/updateDailyMenu/:id', dailyMenuStorage, updateDailyMenu);
router.delete('/deleteDailyMenu/:id', deleteDailyMenu);

module.exports = router;
