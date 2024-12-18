const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const router = express.Router()

const users = [
	{ id: new mongoose.Types.ObjectId(), username: 'superadmin', password: bcrypt.hashSync('password123', 10), role: 'Superadmin' },
	{ id: new mongoose.Types.ObjectId(), username: 'schooladmin', password: bcrypt.hashSync('password123', 10), role: 'SchoolAdmin' },
]

router.post('/login', async (req, res) => {
	const { username, password } = req.body

	const user = users.find(u => u.username === username)
	if (!user) return res.status(404).json({ message: 'User not found' })

	const validPassword = await bcrypt.compare(password, user.password)
	if (!validPassword) return res.status(400).json({ message: 'Invalid credentials' })

	const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })

	res.json({ token })
})

module.exports = router
