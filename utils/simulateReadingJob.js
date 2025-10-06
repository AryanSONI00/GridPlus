const Meter = require("../models/meter.js");
const Alert = require("../models/alert.js");
const { sendAlertEmail, sendFireAlertEmail } = require("./email.js");

function generateReading(min, max, isFloat = true, decimal = 2) {
	const value = Math.random() * (max - min) + min;
	return isFloat ? parseFloat(value.toFixed(decimal)) : Math.floor(value);
}

async function simulateNewReading() {
	const meters = await Meter.find({});
	for (const meter of meters) {
		const current = generateReading(0, 14);
		const voltage = generateReading(215, 240, false);
		const powerFactor = generateReading(0.3, 1, true, 2);
		const temperature = generateReading(-15, 65, false);
		const load = parseFloat((current * voltage * powerFactor).toFixed(2));
		const updatedAt = new Date();

		// Push new values
		meter.current.push(current);
		meter.voltage.push(voltage);
		meter.powerFactor.push(powerFactor);
		meter.temperature.push(temperature);
		meter.load.push(load);
		meter.updatedAt.push(updatedAt);

		// Keep only last 5 readings (optional)
		["current", "voltage", "powerFactor", "temperature", "load", "updatedAt"].forEach(key => {
			if (meter[key].length > 5) meter[key].shift();
		});

		let status = "Healthy";
		let alertCount = 0;
		const alertReasons = [];

		const thresholds = {
			current: { min: 1, max: 13 },
			voltage: { min: 220, max: 240 },
			powerFactor: { min: 0.4, max: 1 },
			temperature: { min: -10, max: 60 },
			load: { min: 0, max: 3400 },
		};

		if (current < thresholds.current.min || current > thresholds.current.max) {
			alertCount++;
			alertReasons.push(`Current ${current}A out of range`);
		}
		if (voltage < thresholds.voltage.min || voltage > thresholds.voltage.max) {
			alertCount++;
			alertReasons.push(`Voltage ${voltage}V out of range`);
		}
		if (powerFactor < thresholds.powerFactor.min || powerFactor > thresholds.powerFactor.max) {
			alertCount++;
			alertReasons.push(`Power Factor ${powerFactor} out of range`);
		}
		if (temperature < thresholds.temperature.min || temperature > thresholds.temperature.max) {
			alertCount++;
			alertReasons.push(`Temperature ${temperature}°C out of range`);
		}
		if (load < thresholds.load.min || load > thresholds.load.max) {
			alertCount++;
			alertReasons.push(`Load ${load}W out of range`);
		}

		if (alertCount > 0) {
			status = "Alert";

			for (let reason of alertReasons) {
				const alert = await Alert.create({
					name: meter.name,
					current,
					voltage,
					powerFactor,
					temperature,
					load,
					reason
				});
				meter.alerts.push(alert._id);
			}

			sendAlertEmail(meter, alertReasons);
		}

		// Fire prediction
		let fire = Math.random() < 0.4;
		if (fire) {
			console.log(`🔥 EMERGENCY: Fire detected at meter ${meter.name} — calling emergency services... 📞`);
			meter.fire = true;
			sendFireAlertEmail(meter.name, meter.location);
		}

		meter.status = status;
		meter.alertCount += alertCount;

		await meter.save();
        await new Promise((res) => setTimeout(res, 500));
	}
}
module.exports = simulateNewReading;
