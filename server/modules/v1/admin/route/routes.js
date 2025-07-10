const express = require("express");
const adminController = require("../controller/admin");
const { getEvents } = require("../../user/controller/user");

const router = express.Router();

router.post("/create-event",adminController.createEvent)
router.get("/events",getEvents)
router.post("/delete",adminController.deleteProduct)
router.get('/userlist',adminController.userList)
router.get('/unapproved',adminController.unapprovedlist)
// router.post("/login",userController.login)
// router.get("/logout",userController.logout)

module.exports = router;  