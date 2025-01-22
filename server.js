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

// Route to trigger LED blink
app.post('/blink-led', (req, res) => {
  
    const { blink } = req.body;  // Extract the blink value from the request body
    
    console.log(req.body);
    
    if (blink === '1') 
    {
      arduinoPort.write('1');  // Send signal to Arduino to turn LED on
      return res.send('LED is turned ON');
    } 
    else if (blink === '0') 
    {
      arduinoPort.write('0');  // Send signal to Arduino to turn LED off
      return res.send('LED is turned OFF');
    } 
    else 
    {
      return res.status(400).send('Invalid value for blink. Use "0" to turn off and "1" to turn on.');
    }
});

app.listen(port, () => {
    console.log(`Server running on http://${host}:${port}`);
});
  