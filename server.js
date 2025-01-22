require('dotenv').config(); // Load environment variables

const express = require('express');

const cors = require('cors'); // Import CORS

const mongoose = require('mongoose');

const SerialPort = require('serialport');

const Readline = require('@serialport/parser-readline');

const app = express();
const host = process.env.HOST || '0.0.0.0'; // Changed to 'localhost'
const port = process.env.PORT || 5000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Serial communication for Arduino
const portName = 'COM4';  // Replace with the correct port where Arduino is connected
const arduinoPort = new SerialPort(portName, { baudRate: 9600 });
const parser = arduinoPort.pipe(new Readline({ delimiter: '\n' }));

arduinoPort.on('open', () => {
    console.log(`Serial Port ${portName} is opened`);
});

app.listen(port, () => {
    console.log(`Server running on http://${host}:${port}`);
});
  