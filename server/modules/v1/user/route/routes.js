const express = require("express");
const userController = require("../controller/user");
// const upload = require("../../../../middleware/multer")
const router = express.Router();

// router.post("/upload",upload.single('image'), userController.uploadImage);
router.post("/signup",userController.signUp)
router.post("/login",userController.login)
router.get("/logout",userController.logout)
router.get("/events",userController.getEvents)
router.post("/event",userController.getEvent)
router.get("/featuredEvents",userController.getFeaturedEvents)
router.post("/searchterm",userController.searchEvent) //filter and search
router.post("/bookmark",userController.bookmark)
router.post("/getbookmark",userController.getBookmarkStatus)
router.post("/create-event",userController.createEvent)
router.get("/getBookmarkedEvents",userController.getBookmarkedEvents)
router.get("/submitted",userController.getsubmitted)

module.exports = router;  