const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/User')
const router = express.Router()

router.post('/login', async (req, res) => {
	const { username, password } = req.body

	if (!username || !password) {
		return res.status(400).json({ message: 'Username and password are required' })
	}

	try {
		const user = await User.findOne({ username })

		if (!user) {
			return res.status(404).json({ message: 'User not found' })
		}

		const validPassword = await bcrypt.compare(password, user.password)

		if (!validPassword) {
			return res.status(400).json({ message: 'Invalid credentials' })
		}

		const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })

		return res.status(200).json({ token })
	} catch (err) {
		console.error('Error logging in:', err)
		return res.status(500).json({ message: 'Server error, please try again later' })
	}
})

module.exports = router
