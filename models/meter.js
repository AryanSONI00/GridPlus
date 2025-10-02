const mongoose = require("mongoose");
const Alert = require("./alert.js");

const meterSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minLength: 2,
		maxLength: 50,
	},
	current: {
		type: [Number],
		required: true,
		min: 0,
		max: 20,
	},
	voltage: {
		type: [Number],
		required: true,
		min: 200,
		max: 280,
	},
	powerFactor: {
		type: [Number],
		required: true,
		min: 0,
		max: 1,
	},
	alertCount: {
		type: Number,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: true,
		minLength: 2,
		maxLength: 150,
	},
	temperature: {
		type: [Number],
		required: true,
		min: -20,
		max: 100,
	},
	load: {
		type: [Number],
		required: true,
	},
	alerts: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Alert",
		},
	],
	updatedAt: [Date],
	fire: {
		type: Boolean,
		default: false,
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
});

//this post middleware will run after a document is deleted to delete its alerts
//findbyidanddelete indirectly calls findOneAndDelete and when findOneAndDelete operation is done on meterSchema this middleware will run automatically
meterSchema.post("findOneAndDelete", async (meter) => {
	if (meter.alerts.length > 0) {
		await Alert.deleteMany({ _id: { $in: meter.alerts } });
	}
});

const Meter = mongoose.model("Meter", meterSchema);
module.exports = Meter;
