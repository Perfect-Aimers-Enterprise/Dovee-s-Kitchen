const express = require('express');
const router = express.Router();
const {eventStorage} = require('../configuration/eventMgtConfig');

const {
    createEventMgt,
    getAllEventMgts,
    getSingleEventMgt,
    updateEventMgt,
    deleteEventMgt
} = require('../controller/eventController')

// Routes
router.post('/createEventMgt', eventStorage, createEventMgt);
router.get('/getAllEventMgts', getAllEventMgts);
router.get('/getSingleEventMgt/:id', getSingleEventMgt);
router.patch('/updateEventMgt/:id', eventStorage, updateEventMgt);
router.delete('/deleteEventMgt/:id', deleteEventMgt);

module.exports = router;