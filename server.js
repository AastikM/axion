const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const errorHandler = require('./middlewares/errorHandler');
const schoolRoutes = require('./routes/school');
const classroomRoutes = require('./routes/classroom');
const studentRoutes = require('./routes/student');
const authRoutes = require('./routes/auth');  // Assuming you already created this route for login
const app = express();
const cors = require('cors');  // Import cors package


// Enable CORS for all routes
app.use(cors());

// Your routes and other server setup

// Load environment variables
dotenv.config();

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

// Use Routes
app.use('/api/schools', schoolRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/auth', authRoutes);
// Global Error Handler
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



