const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); 
const router = express.Router();
const ExpressBrute = require('express-brute');
const rateLimit = require('express-rate-limit');

const store = new ExpressBrute.MemoryStore();
const bruteforce = new ExpressBrute(store, {
  freeRetries: 5,            
  minWait: 5 * 60 * 1000,    
  maxWait: 15 * 60 * 1000,
});

const loginRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 5,                  
  message: {
    status: 429,
    message: "Too many login attempts. Please try again later.",
  },
});

const users = [
  { id: new mongoose.Types.ObjectId(), username: 'superadmin', password: bcrypt.hashSync('password123', 10), role: 'Superadmin' },
  { id: new mongoose.Types.ObjectId(), username: 'schooladmin', password: bcrypt.hashSync('password123', 10), role: 'SchoolAdmin' },
];

router.post('/login', bruteforce.prevent, loginRateLimiter, async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) {
    console.log(`User not found: ${username}`);
    return res.status(401).json({ status: 401, message: 'User not found' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    console.log(`Invalid credentials for user: ${username}`);
    return res.status(401).json({ status: 401, message: 'Invalid credentials' });
  }

  try {
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log(`Generated token for user: ${username}`);
    res.json({ token });
  } catch (error) {
    console.log('Error generating token:', error);
    return res.status(500).json({ status: 500, message: 'Internal server error' });
  }
});

router.use((req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    console.log('Token missing');
    return res.status(401).json({ status: 401, message: 'Token missing or invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded);
    req.user = decoded;  
    next();
  } catch (error) {
    console.log('Token verification failed:', error.message);
    return res.status(400).json({ status: 400, message: 'Token verification failed' });
  }
});

module.exports = router;