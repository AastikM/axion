const jwt = require('jsonwebtoken')

const authenticate = (req, res, next) => {
	const authHeader = req.header('Authorization')
	if (!authHeader) {
		console.warn('Authentication failed: Missing Authorization header')
		return res.status(401).json({ message: 'Access denied. No token provided.' })
	}

	const token = authHeader.split(' ')[1]
	if (!token) {
		console.warn('Authentication failed: Missing token in Authorization header')
		return res.status(401).json({ message: 'Access denied. Token missing.' })
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET)
		console.info('JWT decoded successfully:', decoded)

		req.user = decoded
		next()
	} catch (error) {
		console.error('Token verification failed:', error.message)
		return res.status(400).json({ message: 'Invalid or expired token.' })
	}
}

const authorize =
	(roles = []) =>
	(req, res, next) => {
		if (!req.user || !req.user.role) {
			console.warn('Authorization failed: User role missing in JWT payload')
			return res.status(403).json({ message: 'Access forbidden. User role not found.' })
		}

		const userRole = req.user.role
		console.info(`User role: ${userRole}, Allowed roles: ${roles}`)

		if (!roles.includes(userRole)) {
			console.warn(`Authorization failed: Role "${userRole}" not permitted`)
			return res.status(403).json({ message: 'Access forbidden. Insufficient permissions.' })
		}

		next()
	}

module.exports = { authenticate, authorize }
