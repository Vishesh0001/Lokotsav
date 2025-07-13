const express = require("express");
const adminController = require("../controller/admin");
const { getEvents } = require("../../user/controller/user");

const router = express.Router();

router.post("/create-event",adminController.createEvent)
router.get("/events",getEvents)
router.post("/deleteEvent",adminController.deleteEvent)
router.get('/userlist',adminController.userList)
router.get('/unapproved',adminController.unapprovedlist)
router.post('/approve',adminController.approveEvent)
router.post('/block-user',adminController.blockUser)
router.post('/delete-user',adminController.deleteUser)
router.post('/get-event-by-id', adminController.getEventById);
router.post('/update-event', adminController.updateEvent);

// router.post("/login",userController.login)
// router.get("/logout",userController.logout)

module.exports = router;  