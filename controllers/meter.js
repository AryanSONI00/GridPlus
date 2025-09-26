const Meter = require("../models/meter.js"); // importing the Meter model
const Alert = require("../models/alert.js"); // importing the Meter model
const { sendAlertEmail, sendFireAlertEmail, sendPaymentRequestEmail } = require("../utils/email.js");

module.exports.index = async (req, res) => {
	const allMeters = await Meter.find({});
	// console.log(allMeters);
	res.render("meters/index.ejs", { allMeters });
};

module.exports.createMeter = async (req, res) => {
	let { name, location } = req.body.meter;

	// Generate 5 readings for each parameter
	const current = generateFiveReadings(0, 14);
	const voltage = generateFiveReadings(215, 240, false);
	const powerFactor = generateFiveReadings(0.3, 1, true, 2);
	const temperature = generateFiveReadings(-15, 65, false);
	const load = current.map((c, i) => parseFloat((c * voltage[i] * powerFactor[i]).toFixed(2)));

	// 5 corresponding timestamps
	const updatedAt = Array.from({ length: 5 }, () => new Date());

	// Latest reading (for threshold check)
	const latest = {
		current: current[4],
		voltage: voltage[4],
		powerFactor: powerFactor[4],
		temperature: temperature[4],
		load: load[4],
	};

	// Thresholds
	const thresholds = {
		current: { min: 1, max: 13 },
		voltage: { min: 220, max: 240 },
		powerFactor: { min: 0.4, max: 1 },
		temperature: { min: -10, max: 60 },
		load: { min: 0, max: 3400 },
	};

	let status = "Healthy";
	let alertCount = 0;
	const alertReasons = [];

	if (latest.current < thresholds.current.min || latest.current > thresholds.current.max) {
		alertCount++;
		alertReasons.push(`Current ${latest.current}A out of range (${thresholds.current.min}-${thresholds.current.max})`);
	}
	if (latest.voltage < thresholds.voltage.min || latest.voltage > thresholds.voltage.max) {
		alertCount++;
		alertReasons.push(`Voltage ${latest.voltage}V out of range (${thresholds.voltage.min}-${thresholds.voltage.max})`);
	}
	if (latest.powerFactor < thresholds.powerFactor.min || latest.powerFactor > thresholds.powerFactor.max) {
		alertCount++;
		alertReasons.push(`Power Factor ${latest.powerFactor} out of range (${thresholds.powerFactor.min}-${thresholds.powerFactor.max})`);
	}
	if (latest.temperature < thresholds.temperature.min || latest.temperature > thresholds.temperature.max) {
		alertCount++;
		alertReasons.push(`Temperature ${latest.temperature}°C out of range (${thresholds.temperature.min}-${thresholds.temperature.max})`);
	}
	if (latest.load < thresholds.load.min || latest.load > thresholds.load.max) {
		alertCount++;
		alertReasons.push(`Load ${latest.load}W out of range (${thresholds.load.min}-${thresholds.load.max})`);
	}

	if (alertCount > 0) {
		status = "Alert";
	}
	//Fire prediction logic
	let fire = Math.random() < 0.4;
	if (fire) {
		console.log(`🔥 EMERGENCY: Fire detected at meter "${name}" — calling emergency services... 📞`);
        fire = true;
		sendFireAlertEmail(name, location);
	}

	const newMeter = new Meter({
		name,
		location,
		current,
		voltage,
		powerFactor,
		temperature,
		load,
		updatedAt,
		status,
		alertCount,
		alerts: [],
		fire,
	});
	newMeter.owner = req.user._id;
	await newMeter.save();

	// Create alerts for threshold violations
	if (status === "Alert") {
		for (let reason of alertReasons) {
			const alert = await Alert.create({
				name: name,
				current: latest.current,
				voltage: latest.voltage,
				powerFactor: latest.powerFactor,
				temperature: latest.temperature,
				load: latest.load,
				reason,
			});
			newMeter.alerts.push(alert._id);
		}
		await newMeter.save();
		// Send alert email (non-blocking)
		sendAlertEmail(newMeter, alertReasons);
	}

	req.flash("success", "New meter created successfully!");
	res.redirect("/meters");
};

// Helper function
function generateFiveReadings(min, max, isFloat = true, decimal = 2) {
	const readings = [];
	for (let i = 0; i < 5; i++) {
		let value = Math.random() * (max - min) + min;
		readings.push(isFloat ? parseFloat(value.toFixed(decimal)) : Math.floor(value));
	}
	return readings;
}

module.exports.renderNewForm = (req, res) => {
	res.render("meters/new.ejs");
};

module.exports.showMeter = async (req, res) => {
	let { id } = req.params;
	const meter = await Meter.findById(id).populate("alerts").populate("owner");
	// console.log(meter);
	if (!meter) {
		req.flash("error", "Meter not found!");
		return res.redirect("/meters");
	}
	res.render("meters/show.ejs", { meter });
};

module.exports.updateMeter = async (req, res) => {
	let { id } = req.params;
	const newName = req.body.meter.name;
	// console.log(req.body.meter);
	const updatedMeter = await Meter.findByIdAndUpdate(id, req.body.meter, { new: true });
	await Alert.updateMany({ _id: { $in: updatedMeter.alerts } }, { $set: { name: newName } });
	req.flash("success", "Meter updated successfully!");
	res.redirect(`/meters/${id}`);
};

module.exports.deleteMeter = async (req, res) => {
	let { id } = req.params;
	await Meter.findByIdAndDelete(id);
	req.flash("success", "Meter deleted successfully!");
	res.redirect("/meters");
};

module.exports.renderEditForm = async (req, res) => {
	let { id } = req.params;
	const meter = await Meter.findById(id);
	// console.log(meter);
	if (!meter) {
		req.flash("error", "Meter not found!");
		return res.redirect("/meters");
	}
	res.render("meters/edit.ejs", { meter });
};

module.exports.requestPayment = async (req, res) => {
	let { id } = req.params;
	const meter = await Meter.findById(id).populate("owner");
	if (!meter) {
		req.flash("error", "Meter not found!");
		return res.redirect("/meters");
	}
	sendPaymentRequestEmail(meter);
	req.flash("success", "Payment request email sent!");
	res.redirect(`/meters/${id}`);
};
