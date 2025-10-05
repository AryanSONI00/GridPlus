const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // utility to wrap async functions for error handling
const { isLoggedIn, isOwner } = require("../middleware.js"); // importing the isLoggedIn middleware to check if user is logged in
const {
	index,
	createMeter,
	renderNewForm,
	showMeter,
	updateMeter,
	deleteMeter,
	renderEditForm,
    requestPayment,
} = require("../controllers/meter.js");

/* ---------------------- route to render all meters ---------------------- */
/* ------------------- register a new meter to the database and redirects to the all meters page ------------------- */
router.route("/").get(wrapAsync(index)).post(isLoggedIn, wrapAsync(createMeter));

/* ------------ route to render the form to register a new meter ------------ */
router.get("/new", isLoggedIn, renderNewForm);

/* ----- route to render a particular meter details (using id) user clicked on ---- */
/* ----------------------------------- updates a meter in the database and redirects to the meter page ----------------------------------- */
/* ---------------------------------- deletes a meter from the database and redirects to the all meters page ---------------------------------- */
router.route("/:id").get(wrapAsync(showMeter)).put(isLoggedIn, isOwner, wrapAsync(updateMeter)).delete(isLoggedIn, isOwner, wrapAsync(deleteMeter));

/* --------------------------------------------------------- gets a form to edit a meter -------------------------------------------------------- */
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderEditForm));

// Payment request route
router.post("/:id/request-payment", isLoggedIn, isOwner, wrapAsync(requestPayment));

module.exports = router;
