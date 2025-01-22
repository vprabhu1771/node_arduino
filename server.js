require('dotenv').config(); // Load environment variables

const express = require('express');

const cors = require('cors'); // Import CORS

const mongoose = require('mongoose');

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

app.listen(port, () => {
    console.log(`Server running on http://${host}:${port}`);
});
  