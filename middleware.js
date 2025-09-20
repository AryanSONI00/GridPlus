const ExpressError = require("./utils/ExpressError.js"); // custom error class for Express
const { userSchemaSignup, userSchemaLogin, commentSchema } = require("./schema.js"); // importing the Joi schema for validation
const Meter = require("./models/meter.js");

/* --------------------------------------------- Middleware to validate user signup data using Joi schema --------------------------------------------- */
module.exports.validateUserSignup = (req, res, next) => {
	let { error } = userSchemaSignup.validate(req.body);
	if (error) {
		// If validation fails, throw an error
		throw new ExpressError(400, error);
	} else {
		next();
	}
};

/* --------------------------------------------- Middleware to validate user login data using Joi schema --------------------------------------------- */
module.exports.validateUserLogin = (req, res, next) => {
	let { error } = userSchemaLogin.validate(req.body);
	if (error) {
		// If validation fails, throw an error
		throw new ExpressError(400, error);
	} else {
		next();
	}
};

/* --------------------------------------------- Middleware to validate comment using Joi schema --------------------------------------------- */
module.exports.validateComment = (req, res, next) => {
	let { error } = commentSchema.validate(req.body);
	if (error) {
		// If validation fails, throw an error
		throw new ExpressError(400, error);
	} else {
		next();
	}
};

/* --------------------------------------------- Middleware to check if user is logged in --------------------------------------------- */
module.exports.isLoggedIn = (req, res, next) => {
	// console.log(req.originalUrl);
	if (!req.isAuthenticated()) {
        //
		if (req.method !== "GET" && req.params.id) {
			req.session.redirectUrl = `/meters/${req.params.id}`;
		} else if (req.method === "GET") {
			req.session.redirectUrl = req.originalUrl;
		}
		req.flash("error", "You must be logged in to perform this action!");
		return res.redirect("/login");
	}
	next();
};

/* --------------------------------------------- Middleware to save redirect URL --------------------------------------------- */
module.exports.saveRedirectUrl = (req, res, next) => {
	if (req.session.redirectUrl) {
		res.locals.redirectUrl = req.session.redirectUrl;
	}
	next();
};

/* ------------------------------ Middleware to check if the user is the owner of the meter ----------------------------- */
module.exports.isOwner = async (req, res, next) => {
	let { id } = req.params;
	// console.log(req.body.listing);
	let meter = await Meter.findById(id);
	// only the owner of the listing can edit it
	if (!res.locals.currentUser._id.equals(meter.owner._id)) {
		req.flash("error", "You do not have permission to make changes to this meter!");
		return res.redirect(`/meters/${id}`);
	}
	next();
};
