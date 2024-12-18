const express = require('express')
const School = require('../models/School')
const { authenticate, authorize } = require('../middlewares/auth')
const router = express.Router()

router.post('/', authenticate, authorize(['Superadmin']), async (req, res) => {
	try {
		const { name, address } = req.body

		const newSchool = new School({
			name,
			address,
			createdBy: req.user.id,
		})

		await newSchool.save()
		res.status(201).json(newSchool)
	} catch (err) {
		res.status(500).json({ message: 'Failed to create school', error: err.message })
	}
})

router.get('/', authenticate, authorize(['Superadmin']), async (req, res) => {
	try {
		const schools = await School.find()
		res.status(200).json(schools)
	} catch (err) {
		res.status(500).json({ message: 'Failed to fetch schools', error: err.message })
	}
})

router.get('/:id', authenticate, authorize(['Superadmin']), async (req, res) => {
	try {
		const school = await School.findById(req.params.id)
		if (!school) return res.status(404).json({ message: 'School not found' })
		res.status(200).json(school)
	} catch (err) {
		res.status(500).json({ message: 'Failed to fetch school', error: err.message })
	}
})

router.put('/:id', authenticate, authorize(['Superadmin']), async (req, res) => {
	try {
		const { name, address } = req.body

		const updatedSchool = await School.findByIdAndUpdate(req.params.id, { name, address }, { new: true, runValidators: true })

		if (!updatedSchool) {
			return res.status(404).json({ message: 'School not found' })
		}

		res.status(200).json(updatedSchool)
	} catch (err) {
		res.status(500).json({ message: 'Failed to update school', error: err.message })
	}
})

router.delete('/:id', authenticate, authorize(['Superadmin']), async (req, res) => {
	try {
		const deletedSchool = await School.findByIdAndDelete(req.params.id)

		if (!deletedSchool) {
			return res.status(404).json({ message: 'School not found' })
		}

		res.status(200).json({ message: 'School deleted successfully' })
	} catch (err) {
		res.status(500).json({ message: 'Failed to delete school', error: err.message })
	}
})

module.exports = router
