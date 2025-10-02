const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	current: Number,
	voltage: Number,
	powerFactor: Number,
	temperature: Number,
	load: Number,
	triggeredAt: {
		type: Date,
        default: Date.now,
        required: true,
	},
	reason: {
		type: String,
		required: true,
	},
    acknowledged: {
        type: Boolean,
        default: false,
    },
    comment: {
        type: String,
        minLength: 0,
        maxLength: 100,
        default: "",
    }
});

const Alert = mongoose.model("Alert", alertSchema);
module.exports = Alert;
