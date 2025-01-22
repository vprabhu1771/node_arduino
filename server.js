require('dotenv').config(); // Load environment variables

const express = require('express');

const app = express();
const host = process.env.HOST || '0.0.0.0'; // Changed to 'localhost'
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server running on http://${host}:${port}`);
});
  