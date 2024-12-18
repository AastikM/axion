const errorHandler = (err, req, res, next) => {
	console.error('Error Details:', {
		message: err.message,
		stack: process.env.NODE_ENV !== 'prod' ? err.stack : 'Hidden in production',
		path: req.originalUrl,
		method: req.method,
		body: req.body,
		query: req.query,
		params: req.params,
	})

	const statusCode = err.status || 500
	const response = {
		message: err.message || 'An unexpected error occurred.',
		...(process.env.NODE_ENV !== 'prod' && { stack: err.stack }),
		error: err.errors || null,
	}

	res.status(statusCode).json(response)
}

module.exports = errorHandler
