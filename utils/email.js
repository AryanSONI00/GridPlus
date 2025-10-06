const nodemailer = require("nodemailer");

//fire email
async function sendFireAlertEmail(meterName, location) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true, // Use secure connection
        port: 465, // Port for secure connection
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "aryan000project@gmail.com",
        subject: "🔥 Fire Detected!",
        text: `Fire detected at meter "${meterName}" located at "${location}". Please take immediate action.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("🚨 Fire alert email sent.");
    } catch (err) {
        console.error("❌ Error sending email:", err.message);
    }
}

//alert email
async function sendAlertEmail(meter, alertReasons) {
    const transporter = nodemailer.createTransport({
        service: "gmail", // Or another SMTP provider
        secure: true, // Use secure connection
        port: 465, // Port for secure connection
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const subject = `⚠️ Alert for Meter: ${meter.name}`;
    const text = `
Meter Name: ${meter.name}
Location: ${meter.location}

Reasons:
- ${alertReasons.join("\n- ")}

Latest Readings:
- Current: ${meter.current.at(-1)} A
- Voltage: ${meter.voltage.at(-1)} V
- Power Factor: ${meter.powerFactor.at(-1)}
- Temperature: ${meter.temperature.at(-1)} °C
- Load: ${meter.load.at(-1)} W
    `;

    const mailOptions = {
        from: "projectgroup950@gmail.com",
        to: "aryan000project@gmail.com", // Replace with actual recipient
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("🚨 Alert email sent successfully.");
    } catch (error) {
        console.error("❌ Failed to send alert email:", error);
    }
}

// Payment request email
async function sendPaymentRequestEmail(meter) {
	const transporter = nodemailer.createTransport({
		service: "gmail",
		secure: true,
		port: 465,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	const latestLoad = meter.load.at(-1);
	const paymentAmount = latestLoad * 2;
	const subject = `💰 Payment Request for Meter: ${meter.name}`;
	const text = `Meter Name: ${meter.name}\nLocation: ${meter.location}\n\nLatest Load: ${latestLoad} W\nRequested Payment:

\u20B9${paymentAmount.toFixed(2)}\n\nThis is a dummy payment request for demonstration purposes.`;
	const html = `
        <div style=\"font-family: Arial, sans-serif; padding: 16px; background: #f9f9f9; border-radius: 8px;\">
            <h2 style=\"color: #28a745;\">💸 Payment Request</h2>
            <p><b>Meter Name:</b> <span style=\"color:#007bff\">${meter.name}</span></p>
            <p><b>Location:</b> ${meter.location}</p>
            <p><b>Latest Load:</b> <span style=\"color:#fd7e14\">${latestLoad} W</span></p>
            <p><b>Requested Payment:</b> <span style=\"color:#28a745; font-size:1.3em; font-weight:700;\">&#8377;${paymentAmount.toFixed(
				2
			)}</span></p>
            <hr style=\"margin: 16px 0;\"/>
            <p style=\"color:#555;\">This is a <b>dummy payment request</b> for demonstration purposes.<br>Thank you for using <span style=\"color:#007bff\">GridPlus</span>!</p>
        </div>
    `;

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: meter.owner.email,
		subject,
		text,
		html,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log("💰 Payment request email sent.");
	} catch (err) {
		console.error("❌ Error sending payment request email:", err.message);
	}
}

module.exports = {
    sendFireAlertEmail,
    sendAlertEmail,
    sendPaymentRequestEmail
};
