const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; 
  if (!token) return res.status(401).json({ status: 401, message: 'Token missing or invalid' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded JWT:', decoded);  

    req.user = decoded; 
    next();
  } catch (err) {
    console.log('Token verification failed:', err.message);
    return res.status(400).json({ status: 400, message: 'Invalid or expired token.' });
  }
};

const authorize = (roles) => (req, res, next) => {
    console.log('Roles allowed:', roles);  
  console.log('User Role from JWT:', req.user.role); 

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({status: 403, message: 'Access forbidden. Insufficient permissions.' });
    }
    next();
  };

module.exports = { authenticate, authorize };


