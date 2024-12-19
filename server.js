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
const rateLimit = require('express-rate-limit');

// Global rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 900, // Limit each IP to 900 requests per windowMs
  message: { message: 'Too many requests, try again later.' },
});



const helmet = require('helmet');
app.use(helmet());

// Enable CORS for all routes
app.use(cors());

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
app.use(apiLimiter);

// Start the server only if not in test environment
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
}

// Export app for testing
module.exports = app;