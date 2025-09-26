const Alert = require("../models/alert.js"); // importing the Meter model

module.exports.showAlerts = async (req, res) => {
	const allAlerts = await Alert.find({});
	// console.log(allAlerts);
	res.render("meters/alert.ejs", { allAlerts });
};

module.exports.addComment = async (req, res) => {
	const { id } = req.params;
	const { comment } = req.body;
	await Alert.findByIdAndUpdate(id, { comment: comment.trim() });
    req.flash("success", "Comment added successfully!");
	res.redirect('/alerts');
};

module.exports.addAcknowledgement = async (req, res) => {
	const { id } = req.params;
	// Just set acknowledged to true (since we don't allow unchecking)
	await Alert.findByIdAndUpdate(id, { acknowledged: true });
    req.flash("success", "Acknowledged successfully!");
	res.redirect('/alerts');
};
