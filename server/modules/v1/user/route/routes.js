const express = require("express");
const userController = require("../controller/user");
const router = express.Router();
router.post("/signup",userController.signUp)
router.post("/login",userController.login)
router.post('/verifyotp',userController.verifyOTP)
router.get("/logout",userController.logout)
router.get("/events",userController.getEvents)
router.post("/event",userController.getEvent)
router.get("/featuredEvents",userController.getFeaturedEvents)
router.post("/searchevents",userController.searchEvent)
router.post("/bookmark",userController.bookmark)
router.post("/getbookmark",userController.getBookmarkStatus)
router.post("/create-event",userController.createEvent)
router.get("/getBookmarkedEvents",userController.getBookmarkedEvents)
router.get("/submitted",userController.getsubmitted)
router.get("/approved",userController.getApprovedEvents)
router.get("/unapproved",userController.getUnApprovedEvents)
router.post('/category',userController.getcategory)
router.post('/booking-status',userController.getBookingStatus)
router.post('/book-ticket',userController.placeOrder)
router.post('/payment-data',userController.getPaymentDetails)
router.post('/update-order',userController.updateOrder)
module.exports = router;  