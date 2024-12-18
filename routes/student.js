const express = require('express')
const Student = require('../models/Student')
const { body, validationResult } = require('express-validator')
const { authenticate, authorize } = require('../middlewares/auth')
const router = express.Router()

router.post('/', authenticate, authorize(['SchoolAdmin', 'Superadmin']), [body('firstName').isString().notEmpty().withMessage('First name is required'), body('lastName').isString().notEmpty().withMessage('Last name is required'), body('age').isInt({ min: 5, max: 18 }).withMessage('Age must be between 5 and 18'), body('schoolId').isMongoId().withMessage('Valid schoolId is required'), body('classroomId').isMongoId().withMessage('Valid classroomId is required')], (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() })
	}

	const { firstName, lastName, age, schoolId, classroomId } = req.body
	const student = new Student({
		firstName,
		lastName,
		age,
		school: schoolId,
		classroom: classroomId,
	})

	student
		.save()
		.then(result => res.status(201).json(result))
		.catch(err => res.status(500).json({ message: 'Failed to enroll student', error: err.message }))
})

router.get('/:schoolId', authenticate, authorize(['SchoolAdmin']), async (req, res) => {
	try {
		const students = await Student.find({ school: req.params.schoolId })
		res.status(200).json(students)
	} catch (err) {
		res.status(500).json({ message: 'Failed to fetch students', error: err.message })
	}
})

module.exports = router
