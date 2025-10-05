const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // utility to wrap async functions for error handling
const { isLoggedIn, validateComment } = require("../middleware.js"); // importing the isLoggedIn middleware to check if user is logged in
const { showAlerts, addComment, addAcknowledgement } = require("../controllers/alert.js");

/* ------------ route to render the alert log ------------ */
router.get("/", isLoggedIn, wrapAsync(showAlerts));

// route to post comment
router.put("/:id/comment", isLoggedIn, validateComment, wrapAsync(addComment));

// route to update acknowledgement
router.put("/:id/acknowledge", isLoggedIn, wrapAsync(addAcknowledgement));

module.exports = router;
