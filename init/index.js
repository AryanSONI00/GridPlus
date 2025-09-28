if(process.env.NODE_ENV !== "production") {
    require("dotenv").config({ path: "../.env" }); // load environment variables from .env file in development mode
}
const mongoose = require('mongoose');
const Meter = require("../models/meter.js");// Import the Listing model
const Alert = require("../models/alert.js");// Import the alert model
const User = require("../models/user.js");// Import the user model
const { sampleMeters, sampleAlerts } = require('./data.js');// Import the sample data

const MONGO_URL = process.env.ATLAS_DB; // MongoDB connection URL
main()
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}

// Function to initialize the database with sample data
// This function clears the existing meters and inserts the sample data
const initDB = async () => {
    await Meter.deleteMany({});
    await Alert.deleteMany({});
    await User.deleteMany({});

    const dummyUserId = new mongoose.Types.ObjectId("686d7a12a4f4b63fb354ddf5");
    const dummyUser = new User({
        _id: dummyUserId,
        username: process.env.DEMO_USERNAME,
        email: process.env.DEMO_EMAIL,
    });
    await User.register(dummyUser, process.env.DEMO_PASSWORD);

    const insertedAlerts = await Alert.insertMany(sampleAlerts);
    // Map alert IDs to their respective meters by name
    const alertMap = {};
    insertedAlerts.forEach(alert => {
        if (!alertMap[alert.name]) alertMap[alert.name] = [];
        alertMap[alert.name].push(alert._id);
    });

    // Assign alert ObjectIds to their respective meters
    const updatedMeters = sampleMeters.map(meter => {
        if (alertMap[meter.name]) {
            meter.alerts = alertMap[meter.name];
            meter.alertCount = alertMap[meter.name].length;
            meter.status = "Alert";
        }
        return meter;
    });

    // Insert updated meters
    await Meter.insertMany(updatedMeters);
    console.log("Database initialized with sample data");
}

initDB()
    .then(() => {
        console.log("Database initialization complete");
    })
    .catch((err) => {
        console.error("Error initializing database:", err);
    });
