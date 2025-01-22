import express from 'express';
import { SerialPort } from 'serialport';

// Initialize the express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Serial port setup
let arduinoPort;

try {
  // Create and open a connection to the Arduino
  arduinoPort = new SerialPort({ path: 'COM4', baudRate: 9600 });

  // Event listener for when the port is opened
  arduinoPort.on('open', () => {
    console.log('Serial port COM4 opened successfully');
  });

  // Handle serial port errors
  arduinoPort.on('error', (err) => {
    console.error(`Error opening serial port: ${err.message}`);
  });
} catch (error) {
  console.error('Error initializing the serial port:', error);
}

// Route to control LED blinking on the Arduino
app.post('/blink', (req, res) => {
  if (!arduinoPort || !arduinoPort.isOpen) {
    return res.status(500).send({
      message: 'Error: Serial port is not open',
    });
  }

  const { blink } = req.body; // Expecting a "blink" parameter in the request body
  const command = blink ? '1' : '0'; // Send '1' to turn on the LED, '0' to turn it off

  // Write the command to the Arduino
  arduinoPort.write(command, (err) => {
    if (err) {
      return res.status(501).send({
        message: err.message || 'Internal Server Error',
      });
    }
    res.status(200).send({
      message: 'LED Blink Successful',
    });
  });
});

// Start the server on port 5000
const port = 8000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Cleanup the serial port when the process exits
process.on('exit', () => {
  if (arduinoPort && arduinoPort.isOpen) {
    arduinoPort.close(() => {
      console.log('Serial port closed');
    });
  }
});

process.on('SIGINT', () => {
  if (arduinoPort && arduinoPort.isOpen) {
    arduinoPort.close(() => {
      console.log('Serial port closed on SIGINT');
      process.exit();
    });
  }
});
