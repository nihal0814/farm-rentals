// Load environment variables first
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize Express
const app = express();

// Connect to the Database
connectDB();

// Essential Middleware
app.use(cors()); // Allows your React frontend to make requests here
app.use(express.json()); // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// A basic test route to ensure the server is responding
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: '🚜 Farm Equipment API is running smoothly!' });
});

// We will mount our actual routes here later
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/equipment', require('./routes/equipmentRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Define the Port and start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});